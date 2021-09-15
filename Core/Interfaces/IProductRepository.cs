using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IProductRepository
    {
        //For Products
        Task<IReadOnlyList<Product>> GetProductsAsync();
        Task<Product> GetProductByIdAsync(int id);

        // For Brands
        Task<IReadOnlyList<ProductBrand>> GetBrandsAsync();
        // Task<ProductBrand> GetBrandByIdAsync(int id);

        //For Products Types
        Task<IReadOnlyList<ProductType>> GetTypesAsync();
        // Task<ProductBrand> GetBrnadByIdAsync(int id);

    }
}