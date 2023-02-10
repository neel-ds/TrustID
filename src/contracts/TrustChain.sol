pragma solidity ^0.8.17;

contract TrustChain {
    struct Product {
        uint256 productId;
        string name;
        string description;
        string imageURL;
        string[] locationStatuses;
        uint256[] timestamp;
        string[] locationURL;
    }

    mapping(uint256 => Product) public products;

    // Array to store product Ids
    uint256[] public productIds;

    uint256 public productCount = 0;

    function addProduct(
        uint256 _id,
        string memory _name,
        string memory _description,
        string memory _location,
        string memory _imageURL,
        string memory _locationURL
    ) public {
        productCount++;
        products[_id] = Product(
            _id,
            _name,
            _description,
            _imageURL,
            new string[](0),
            new uint256[](0),
            new string[](0)
        );
        products[_id].locationStatuses.push(_location);
        products[_id].timestamp.push(block.timestamp);
        products[_id].locationURL.push(_locationURL);
        productIds.push(_id);
    }

    function addLocationStatus(
        uint256 _id,
        string memory _locationStatus,
        string memory _locationURL
    ) public {
        Product storage _product = products[_id];
        _product.locationStatuses.push(_locationStatus);
        _product.locationURL.push(_locationURL);
    }

    function getProduct(uint256 _id) public view returns (Product memory) {
        return (products[_id]);
    }

    function getProductCount() public view returns (uint256) {
        return productCount;
    }

    // Get all products
    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory _products = new Product[](productIds.length);
        // For each product id, get the product and add it to the array
        for (uint256 i = 0; i < productIds.length; i++) {
            _products[i] = products[productIds[i]];
        }
        return _products;
    }
}
