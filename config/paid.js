async function checkPaid(transactionId) {
    try {
        const response = await axios.get(`${process.env.API_GET_PAID}/${transactionId}`, {
            headers: {
                'Authorization': `Apikey ${process.env.API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error checking payment status:", error);
        throw error;
    }
}
