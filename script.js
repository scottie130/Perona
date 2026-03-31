// script.js

// Register user
function registerUser(){
    let name = document.getElementById('regName').value;
    let email = document.getElementById('regEmail').value;
    let password = document.getElementById('regPassword').value;

    if(!name || !email || !password){
        alert('Fill all fields');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');

    if(users.find(u=>u.email===email)){
        alert('Email already exists');
        return;
    }

    users.push({name,email,password,balance:0,profit:0});
    localStorage.setItem('users',JSON.stringify(users));
    alert('Account created!');
    window.location.href='login.html';
}

// Login user
function loginUser(){
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u=>u.email===email && u.password===password);

    if(!user){
        alert('Invalid login');
        return;
    }

    localStorage.setItem('currentUser',JSON.stringify(user));
    window.location.href='dashboard.html';
}

// Load dashboard
if(document.getElementById('balance')){
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if(user){
        document.getElementById('balance').innerText = '$'+user.balance;
        document.getElementById('profit').innerText = '$'+user.profit;
    }
}

// Deposit
function makeDeposit(){
    let amount = parseFloat(document.getElementById('depositAmount').value);
    if(!amount || amount<=0){
        alert('Enter valid amount');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.balance += amount;

    // Update user in users array
    users = users.map(u => u.email === currentUser.email ? currentUser : u);
    localStorage.setItem('users',JSON.stringify(users));
    localStorage.setItem('currentUser',JSON.stringify(currentUser));

    alert('Deposit successful! New balance: $'+currentUser.balance);
    window.location.href='dashboard.html';
}

// Invest in plan
function investPlan(name,deposit,profitPercent,duration){
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(currentUser.balance<deposit){
        alert('Insufficient balance');
        return;
    }

    currentUser.balance -= deposit;
    currentUser.profit += deposit*(profitPercent/100);

    users = users.map(u => u.email === currentUser.email ? currentUser : u);
    localStorage.setItem('users',JSON.stringify(users));
    localStorage.setItem('currentUser',JSON.stringify(currentUser));

    alert(`Invested in ${name} plan! Expected Profit: $${deposit*(profitPercent/100)}`);
    window.location.href='dashboard.html';
}

// Make deposit (pending for admin approval)
function makeDeposit(){
    let amount = parseFloat(document.getElementById('depositAmount').value);
    if(!amount || amount<=0){
        alert('Enter valid amount');
        return;
    }

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let deposits = JSON.parse(localStorage.getItem('deposits') || '[]');

    deposits.push({user: currentUser.email, amount: amount, status: 'pending'});
    localStorage.setItem('deposits', JSON.stringify(deposits));

    alert('Deposit request sent! Waiting admin approval.');
    window.location.href='dashboard.html';
}

// Request withdrawal
function requestWithdrawal(amount){
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(amount > currentUser.balance){
        alert('Insufficient balance');
        return;
    }

    let withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    withdrawals.push({user: currentUser.email, amount: amount, status: 'pending'});
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
    alert('Withdrawal request sent! Waiting admin approval.');
}