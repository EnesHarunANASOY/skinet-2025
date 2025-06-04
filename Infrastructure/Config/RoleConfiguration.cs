using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
{
    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        builder.HasData(
            new IdentityRole { Id="9C51B261-BF59-4F4A-93CF-78E1A34DF776", Name = "Admin", NormalizedName = "ADMIN" },
            new IdentityRole { Id ="2B7D742F-6752-42CB-A5B3-5CF3571BE8D3", Name = "Customer", NormalizedName = "CUSTOMER" }
        );
    }
}
