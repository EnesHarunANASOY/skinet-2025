using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using Product = Core.Entities.Product;

namespace Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly ICartService cartService;
    private readonly IUnitOfWork unit;

    public PaymentService(IConfiguration config, ICartService cartService, /*IGenericRepository<Product> productRepo,IGenericRepository<DeliveryMethod> dmRepo*/ IUnitOfWork unit)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
        this.cartService = cartService;
        this.unit = unit;
    }

    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        var cart = await cartService.GetCartAsync(cartId) ?? throw new Exception("Cart Unavailable");
        var shippingPrice = await GetShippingPriceAsync(cart) ?? 0;

        //Checks if the item's price has changed in the cart
        foreach (var item in cart.Items)
        {
            var productItem = await unit.Repository<Product>().GetByIdAsync(item.ProductId) ?? throw new Exception("Prodcut not available");
            if (item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            }
        }

        var subTotal = CalcualteSubtotal(cart);

        if (cart.Coupon != null)
        {
            subTotal = await ApplyDiscountAsync(cart.Coupon, subTotal);
        }

        var total = subTotal + shippingPrice;

        var services = new PaymentIntentService();

        PaymentIntent? intent = null;

        if (string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = total,
                Currency = "usd",
                PaymentMethodTypes = ["card"]
            };
            intent = await services.CreateAsync(options);
            cart.PaymentIntentId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }

        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = total
            };

            intent = await services.UpdateAsync(cart.PaymentIntentId, options);
        }

        await cartService.SetCartAsync(cart);

        return cart;
    }

    public async Task<string> RefundPayment(string paymentIntentId)
    {
        var reafundOptions = new RefundCreateOptions
        {
            PaymentIntent = paymentIntentId
        };

        var refundService = new RefundService();
        var result = await refundService.CreateAsync(reafundOptions);

        return result.Status;
    }

    private async Task<long> ApplyDiscountAsync(AppCoupon AppCoupon, long subTotal)
    {
        var couponService = new Stripe.CouponService();

        var coupon = await couponService.GetAsync(AppCoupon.CouponId);

        if (coupon.PercentOff.HasValue)
        {
            var discount = subTotal * (coupon.PercentOff.Value / 100);
            subTotal -= (long)discount;
        }
        return subTotal;
    }

    private long CalcualteSubtotal(ShoppingCart cart)
    {
        var itemTotal = cart.Items.Sum(x => x.Quantity * x.Price * 100);
        return (long)itemTotal;        
    }

    private async Task<long?> GetShippingPriceAsync(ShoppingCart cart)
    {
        if (cart.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId) ?? throw new Exception("Problem with delivery method");

            return (long)deliveryMethod.Price * 100;
        }

        return null;
          
    }
}
