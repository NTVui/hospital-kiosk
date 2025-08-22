module.exports.pricesBHYT=(services)=>{
    const newServices = services.map((item) =>{
        item.priceNew = (item.price*(100-item.discountPercentage)/100).toFixed(0);
        return item;
    });
    return newServices
}
