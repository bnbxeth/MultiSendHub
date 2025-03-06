const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.testnet.monad.xyz'));

// ERC-20 Token Contract ABI with batchTransfer function
const tokenABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "recipients",
                "type": "address[]"
            },
            {
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "name": "batchTransfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const tokenAddress = '0xYourTokenAddress'; // Replace with your token address

async function sendTokensToMultiple() {
    const recipientAddresses = document.getElementById('recipients').value.split(','); // Addresses separated by comma
    const amounts = document.getElementById('amounts').value.split(','); // Amounts separated by comma

    if (recipientAddresses.length !== amounts.length) {
        alert("Recipients and amounts do not match!");
        return;
    }

    if (recipientAddresses.length > 200) {
        alert("Please limit the number of addresses to 200!");
        return;
    }

    if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
        alert("Please install MetaMask!");
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];
    const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

    const weiAmounts = amounts.map(amount => web3.utils.toWei(amount, 'ether')); // Convert amounts to Wei

    try {
        await tokenContract.methods.batchTransfer(recipientAddresses, weiAmounts).send({ from: sender });
        alert("Tokens sent to multiple addresses successfully!");
    } catch (error) {
        console.error("Error sending tokens:", error);
        alert("Error sending tokens. Please check the console for more details.");
    }
}
