export class Variant {
    constructor(name = "", sku = "", barcode = "", price = 0, wholePrice = 0, distributePrice = 0) {
        this.id = Date.now();
        this.name = name;
        this.sku = sku;
        this.barcode = barcode;
        this.price = price;
        this.wholePrice = wholePrice;
        this.distributePrice = distributePrice;
        this.status = 1;
    }
}
