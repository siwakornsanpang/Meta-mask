const contractAddress = "0xE3E6D9324A6358d895a6ba59a18Fa8b1ae6A5b57"; // ใส่ที่อยู่ของ Contract ที่นี่
<script src="https://cdn.jsdelivr.net/npm/web3@1.8.1/dist/web3.min.js"></script>
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "CandidateAdded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "endVoting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "resetVoting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "ResultsViewed",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "startVoting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_candidateName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_points",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "candidateName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			}
		],
		"name": "VoteSubmitted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "VotingReset",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "voterPoints",
				"type": "uint256"
			}
		],
		"name": "VotingStarted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllCandidates",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyPoints",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "remainingPoints",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "hasVoted",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewResultsSummary",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "totalVotes",
						"type": "uint256"
					}
				],
				"internalType": "struct CumulativeVoting.Candidate[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "votingEnded",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "votingStarted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];// ใส่ ABI ของ Contract ที่นี่

let web3;
let contract;

async function init() {
    try {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Web3 and contract initialized successfully.");
        } else {
            alert("MetaMask is not installed. Please install MetaMask to proceed.");
        }
    } catch (error) {
        console.error("Failed to initialize Web3 or contract:", error);
        alert("Failed to initialize Web3. Please check your MetaMask and network settings.");
    }
}

// ตรวจสอบบทบาทของผู้ใช้
async function checkRole() {
    try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        console.log("Connected account:", accounts[0]);  // ดูว่ามี account หรือไม่
        const currentAddress = accounts[0].toLowerCase();

        const adminAddress = (await contract.methods.admin().call()).toLowerCase();
        console.log("Admin address:", adminAddress);  // ดูว่า admin address ตรงกับที่คาดหวังหรือไม่

        if (currentAddress === adminAddress) {
            console.log("User is Admin. Redirecting to admin.html.");
            window.location.href = "admin.html";  // ถ้าเป็น admin พาไปหน้า admin
        } else {
            console.log("User is not Admin. Redirecting to voter.html.");
            window.location.href = "voter.html";  // ถ้าไม่ใช่ admin พาไปหน้า voter
        }
    } catch (error) {
        console.error("Error checking role:", error);
        alert("Error checking role. Please try again.");
    }
}



// ฟังก์ชันของ Admin
async function addCandidate() {
    const name = prompt("Enter Candidate Name:");
    if (!name) return;

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    await contract.methods.addCandidate(name).send({ from: accounts[0] });
    alert(`Candidate "${name}" added.`);
}

async function startVoting() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    await contract.methods.startVoting().send({ from: accounts[0] });
    alert("Voting started.");
}

async function endVoting() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    await contract.methods.endVoting().send({ from: accounts[0] });
    alert("Voting ended.");
}

async function resetVoting() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    await contract.methods.resetVoting().send({ from: accounts[0] });
    alert("Voting reset.");
}

// ฟังก์ชันของ Voter
async function viewCandidates() {
    const candidates = await contract.methods.getAllCandidates().call();
    const candidatesList = document.getElementById("candidatesList");
    
    // Clear previous list
    candidatesList.innerHTML = "";

    // Loop through the candidates and add each one to the list
    candidates.forEach(candidate => {
        const listItem = document.createElement("li");
        listItem.textContent = candidate;
        candidatesList.appendChild(listItem);
    });
}

async function voteCandidate() {
    const name = prompt("Enter Candidate Name:");
    const points = prompt("Enter Points:");
    if (!name || !points) return;

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    await contract.methods.vote(name, points).send({ from: accounts[0] });
    alert(`Voted ${points} points for ${name}.`);
}

async function viewResults() {
    const results = await contract.methods.viewResultsSummary().call();
    let message = "Results:\n";
    results.forEach((candidate) => {
        message += `${candidate.name}: ${candidate.totalVotes} votes\n`;
    });
    alert(message);
}

// ฟังก์ชันแสดงคะแนนของผู้โหวต
async function getMyPoints() {
    try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const pointsData = await contract.methods.getMyPoints().call({ from: accounts[0] });
        const points = pointsData[0];
        const hasVoted = pointsData[1] ? "Yes" : "No";

        // แสดงคะแนนที่เหลือของผู้โหวต
        document.getElementById("pointsResult").innerText = `Remaining Points: ${points}, Has Voted: ${hasVoted}`;
    } catch (error) {
        console.error("Error getting points:", error);
        alert("Failed to fetch points. Please try again.");
    }
}

// เรียกฟังก์ชันเมื่อโหลดหน้าเว็บ
window.onload = init;

// เพิ่ม event listener สำหรับการเชื่อมต่อกระเป๋า MetaMask
document.getElementById("connectWallet")?.addEventListener("click", checkRole);

document.getElementById("connectWallet").addEventListener("click", checkRole);