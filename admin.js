const adminUser = {username: "admin", password: "admin123"};

function adminLogin(){
    let username = document.getElementById('adminUsername').value;
    let password = document.getElementById('adminPassword').value;

    if(username === adminUser.username && password === adminUser.password){
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'admin.html';
    } else {
        alert('Invalid admin credentials');
    }
}

// Check if admin is logged in
if(window.location.pathname.includes('admin.html')){
    if(localStorage.getItem('adminLoggedIn') !== 'true'){
        alert('Please login as admin');
        window.location.href = 'admin-login.html';
    }

    // Load users
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach((u, index)=>{
        userList.innerHTML += `<p>${u.name} - ${u.email} - Balance: $${u.balance} - Profit: $${u.profit}</p>`;
    });

    // Load deposits
    let deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    let depositList = document.getElementById('depositList');
    depositList.innerHTML = '';
    deposits.forEach((d, index)=>{
        if(d.status === 'pending'){
            depositList.innerHTML += `<p>${d.user} - $${d.amount} <button onclick="approveDeposit(${index})">Approve</button></p>`;
        }
    });

    // Load withdrawals
    let withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    let withdrawalList = document.getElementById('withdrawalList');
    withdrawalList.innerHTML = '';
    withdrawals.forEach((w, index)=>{
        if(w.status === 'pending'){
            withdrawalList.innerHTML += `<p>${w.user} - $${w.amount} <button onclick="approveWithdrawal(${index})">Approve</button></p>`;
        }
    });
}

// Approve deposit
function approveDeposit(index){
    let deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    let deposit = deposits[index];
    deposit.status = 'approved';

    // Add to user balance
    users = users.map(u=>{
        if(u.email === deposit.user){
            u.balance += deposit.amount;
        }
        return u;
    });

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('deposits', JSON.stringify(deposits));
    alert('Deposit approved!');
    window.location.reload();
}

// Approve withdrawal
function approveWithdrawal(index){
    let withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    let withdrawal = withdrawals[index];
    withdrawal.status = 'approved';

    // Deduct from user balance
    users = users.map(u=>{
        if(u.email === withdrawal.user){
            u.balance -= withdrawal.amount;
        }
        return u;
    });

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
    alert('Withdrawal approved!');
    window.location.reload();
}