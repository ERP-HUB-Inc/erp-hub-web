 const Exchange = {
    dollarToRiel : (amount, rate= 1) => {
        if (amount && rate){
            return amount * rate;
        }
        return  0;
    },

    rielToDollar : (amount, rate= 1) =>{
        if (amount && rate){
            return amount / rate;
        }
        return  0;
    }
};

 export default Exchange;