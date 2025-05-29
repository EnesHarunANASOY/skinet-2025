using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class CouponService(IConfiguration config) : ICouponService
{
    public async Task<AppCoupon?> GetCouponFromPromoCode(string code)
    {

        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

        var promotionService = new PromotionCodeService();

        var options = new PromotionCodeListOptions
        {
            Code = code
        };

        var promotionCodes = await promotionService.ListAsync(options);

        var prototionCode = promotionCodes.FirstOrDefault();


        if (prototionCode != null && prototionCode.Coupon != null)
        {
            return new AppCoupon
            {
                Name = prototionCode.Coupon.Name,
                AmountOff = prototionCode.Coupon.AmountOff,
                PercentOff = prototionCode.Coupon.PercentOff,
                CouponId = prototionCode.Coupon.Id,
                PromotionCode = prototionCode.Code,
            
            };
        }

        return null;
    }
}
