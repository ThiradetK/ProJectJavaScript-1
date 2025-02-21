'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  // owner: 'Jonas Schmedtmann',
  owner: 'Thiradet Kawita',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  // owner: 'Jessica Davis',
  owner: 'Nichapon Siwi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
            <div class="movements__row">
              <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
              <div class="movements__value">${mov}€</div>
            </div>
    
            `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // console.log(incomes);
  labelSumIn.textContent = `${incomes} €`;

  const Out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // console.log(incomes);
  labelSumOut.textContent = `${Math.abs(Out)} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((mov, i, arr) => {
      // console.log(arr);
      return mov >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

////////////////////////////////////////////////////////////////////////////
// The computing  Usernames

const createUsername = function (acc) {
  acc.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsername(accounts);
// console.log(accounts);

const UpdateUI = function (acc) {
  // Display movement
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// console.log(`username : ${account1.username} \nPassword : ${account1.pin}`);

// Event handler
// Implementing Login
let currentAccount; // Gobal
btnLogin.addEventListener('click', function (e) {
  // Prevent form form submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner
      // .split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    UpdateUI(currentAccount);
  }
});

// Implementing Tranfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username
  ) {
    // Doing tranfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    UpdateUI(currentAccount);
  }
});

// สร้างเงื่อนการกู้เงิน
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Ad movement
    currentAccount.movements.push(amount);

    // Update UI
    UpdateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// The findIndex Method
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // Delete account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
    // Set default
    labelWelcome.textContent = 'Log in to get started';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});
// Sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

//slice method
console.log('slice method');
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

//splice method
console.log('\n splice method');
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

//reverse method
console.log('\n reverse method');
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//concat method
console.log('\n concat method');
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//join method
console.log('\n join method');
console.log(letters.join(' - '));

//forEach method
console.log('\n forEach method');
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}
*/

/*
/////////////////////////////////////////////////////
// The New Method

const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// getting the last element of the array
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('Jonas'.at(0));
console.log('Jonas'.at(-1));
*/

/*
/////////////////////////////////////////////////////
// Looping Arrays: forEach Method

console.log('\n Looping Arrays: forEach Method');
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

// forEach method
console.log('\n forEach method');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}:You withdrew ${Math.abs(mov)}`);
  }
});

forEach(10000);
// 0: function(200)
// 1: function(450)
// 2: function(400)
*/

/*
/////////////////////////////////////////////////////
// forEach With Maps and Sets

// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

ForLoop ลองเขียนดูเฉยๆ
for (const [key, value] of currencies) {
  console.log(`${key}: ${value}`);
}

// Set
const cuurenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(cuurenciesUnique);
cuurenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
*/

/*
////////////////////////////////////////////////////////////////////////////////
// Coding Challenge #1

Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Your tasks:

Create a function 'checkDogs', which accepts 2 arrays of dog's ages
('dogsJulia' and 'dogsKate'), and does the following things:
1. Julia found out that the owners of the first and the last two dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶 ")
4. Run the function for both test datasets

Test data:

 - Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
 - Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

Hints: Use tools from all lectures in this section so far 😉

GOOD LUCK 😀


const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  // console.log(dogsJuliaCorrected);

  const dogs = dogsJuliaCorrected.concat(dogsKate);
  // console.log(dogs);

  console.log('\n method for loop');

  /////////////////////////////////////////////////

  for (const [i, yearh] of dogs.entries()) {
    // const result =
    //   yearh >= 3
    //     ? `Dog number ${i + 1} is an adult, and is ${yearh} years old`
    //     : `Dog number ${i + 1} is still a puppy 🐶`;
    // console.log(result);
    console.log(
      `${
        yearh >= 3
          ? `Dog number ${i + 1} is an adult, and is ${yearh} years old`
          : `Dog number ${i + 1} is still a puppy 🐶`
      }`
    );
  }
  ////////////////////////////////////////////////

  console.log('\n method forEach');
  dogs.forEach(function (YY, n) {
    // const result2 =
    //   YY >= 3
    //     ? `Dog number ${n + 1} is an adult, and is ${YY} years old`
    //     : `Dog number ${n + 1} is still a puppy 🐶`;
    // // console.log(result2);
    console.log(
      `${
        YY >= 3
          ? `Dog number ${n + 1} is an adult, and is ${YY} years old`
          : `Dog number ${n + 1} is still a puppy 🐶`
      }`
    );
  });
};

// const JuliaData = [3, 5, 2, 12, 7];
// const KateData = [4, 1, 15, 8, 3];

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/

/*
////////////////////////////////////////////////////////////////////////////
// The map Method

const movements = [200, 450, -400, 3000, 650, -130, 70, 1300];
const eurToUsd = 1.1;

const movementsUSD = movements.map(function (mov) {
  return mov * eurToUsd;
  // return 23;
});

console.log(movements);
console.log(movementsUSD);

//  Challenge จากจาร
// const movementsUSD = movements.map(mov => mov * eurToUsd);
// console.log(movementsUSD);


const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementsDescriptions = movements.map((mov, i, arr) => {
  // เขียนแบบย่อ
  return `Movement ${i + 1}: You ${
    mov > 0 ? 'deposited' : 'withdrew'
  } ${Math.abs(mov)}`;

  //  เขียนแบบเต็มๆ
  // if (mov > 0) {
  //   return `Movement ${i + 1}: You deposited ${mov}`;
  // } else {
  //   return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
  // }
});

console.log(movementsDescriptions);
*/

/*
////////////////////////////////////////////////////////////////////////////
// The Filter Method
const movements = [200, 450, -400, 3000, 650, -130, 70, 1300];
console.log(movements);

// FILTER
console.log('\n Fliter Method');
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

// For Loop
console.log('\n Foor Loop');
const depositFor = [];
for (const mov of movements) if (mov > 0) depositFor.push(mov);
console.log(depositFor);

// FILTER
console.log('\n Fliter Method');
const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrawals);

// FILTER + ARROW FUNCTION
console.log('\n Fliter Method');
const withdrawals2 = movements.filter(mov => mov < 0);
console.log(withdrawals2);

// For Loop
console.log('\n Foor Loop');
const withdrawalsFor = [];
for (const mov of movements) if (mov < 0) withdrawalsFor.push(mov);
console.log(withdrawalsFor);
*/

/*
////////////////////////////////////////////////////////////////////////////
// The reduce Method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

// accumulate -> SNOWBALL
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc} `);
//   return acc + cur;
// }, 0);

const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// Maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(`max value : ${max}`);
*/

/*
////////////////////////////////////////////////////////////////////////////////
// Coding Challenge #2

// Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
// ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
// 4. Run the function for both test datasets

// Test data:
//  Data 1: [5, 2, 4, 1, 15, 8, 3]
//  Data 2: [16, 6, 10, 5, 6, 1, 4]

// GOOD LUCK 😀

// ของผม
// const calcAverageHumanAge = function (ages) {
//   return ages
//     .map(ages => (ages <= 2 ? 2 * ages : 16 + ages * 4))
//     .filter(humanAge => humanAge >= 18)
//     .reduce((sum, age, i, arr) => sum + age / arr.length, 0);
// };

// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];

// console.log(calcAverageHumanAge(data1));
// console.log(calcAverageHumanAge(data2));

// ของอาจารย์
const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(dogAge =>
    dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
  );
  console.log(humanAges);

  const adults = humanAges.filter(humanAge => humanAge >= 18);
  console.log(adults);

  const AverageHumanAges = adults.reduce(
    (acc, age, i, arr) => acc + age / arr.length,
    0
  );
  // adults.reduce((acc, age) => acc + age, 0) / adults.length;
  return AverageHumanAges;
};

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const avg1 = calcAverageHumanAge(data1);
const avg2 = calcAverageHumanAge(data2);

console.log(avg1, avg2);
*/

/*
/////////////////////////////////////////////////////////////////////////////////////////
// The Magic of Chaining Method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
console.log(movements);

// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUsd;
  })
  // .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);
*/

/*
/////////////////////////////////////////////////////////////////////////////////////////
// Coding Challenge #3
// Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time as an arrow function, and using chaining!

// Test data:
// Data 1: [5, 2, 4, 1, 15, 8, 3]
// Data 2: [16, 6, 10, 5, 6, 1, 4]

// GOOD LUCK 😀

const calcAverageHumanAge = age =>
  age
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(humanAge => humanAge >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

const avg1 = calcAverageHumanAge(data1);
const avg2 = calcAverageHumanAge(data2);

console.log(avg1, avg2);
*/

/*
///////////////////////////////////
// The Find Method
const firstWithdrawal = movements.find(mov => mov < 0);
const firstWithdrawalForFilter = movements.filter(mov => mov < 0);
console.log(firstWithdrawal);
console.log(firstWithdrawalForFilter);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/

/*
// The New findLast and FindLastIndex Method
console.log(movements);
const lastWithdrawal = movements.findLast(mov => mov < 0);
console.log(lastWithdrawal);

const lastestLargeMovementsIndex = movements.findLastIndex(
  mov => Math.abs(mov) > 1000
);
console.log(lastestLargeMovementsIndex);

console.log(
  `Your lastest large movement was ${
    movements.length - lastestLargeMovementsIndex
  } movement ago`
);
*/

/*
/////////////////////////////////////////////////////////////////////////
// some and every
console.log(movements);

// EQUALITY
console.log(movements.includes(-130));

// SOME : CONDITION
console.log(movements.some(mov => mov === -130));

const anyDeposite = movements.some(mov => mov > 0);
console.log(anyDeposite);

// EVERY : CONDITION
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov < 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

/*
//////////////////////////////////////////////////////////
// Flat And FlatMap
// Flat
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat());
console.log(arrDeep.flat(1)); // ค่าเริ่มต้น 1
console.log(arrDeep.flat(2)); // แตก Array 2 ชั้น

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

const overallBalances = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalances);

// FlateMap
const overallBalances2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalances2);
*/

/*
/////////////////////////////////////////////////////////////////////////////////////////////
// Coding Challenge #4
This time, Julia and Kate are studying the activity levels of different dog breeds.
YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false",
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

ครั้งนี้ Julia และ Kate กำลังศึกษาระดับกิจกรรมของสายพันธุ์สุนัขที่แตกต่างกัน
งานของคุณ:
1. เก็บค่าน้ำหนักเฉลี่ยของ "Husky" ไว้ในตัวแปร "huskyWeight"

2. ค้นหาชื่อของสายพันธุ์เดียวที่ชอบทั้ง "running" และ "fetch" แล้วเก็บไว้ในตัวแปร "dogBothActivities"

3. สร้างอาร์เรย์ "allActivities" ซึ่งเก็บกิจกรรมทั้งหมดของทุกสายพันธุ์สุนัข

4. สร้างอาร์เรย์ "uniqueActivities" ที่เก็บเฉพาะกิจกรรมที่ไม่ซ้ำกัน (ไม่มีการทำซ้ำของกิจกรรม)
คำใบ้: ใช้เทคนิคที่เกี่ยวข้องกับโครงสร้างข้อมูลพิเศษที่เราเรียนไปไม่กี่บทก่อน

5. มีสายพันธุ์สุนัขหลายตัวที่ชอบว่ายน้ำ สายพันธุ์เหล่านี้ชอบทำกิจกรรมอะไรอีกบ้าง?
เก็บ กิจกรรมอื่น ๆ ที่พวกมันชอบทำลงในอาร์เรย์ "swimmingAdjacent" ซึ่งต้องไม่มีค่าซ้ำกัน

6.ทุกสายพันธุ์มีน้ำหนักเฉลี่ย 10 กิโลกรัมขึ้นไป หรือไม่?
พิมพ์ "true" หรือ "false" ลงใน console

7.มีสายพันธุ์ใดที่เป็น "active" หรือไม่?
"Active" หมายถึงสายพันธุ์ที่มีกิจกรรม 3 อย่างขึ้นไป
พิมพ์ "true" หรือ "false" ลงใน console

โบนัส:
น้ำหนักเฉลี่ยของสายพันธุ์ที่หนักที่สุดที่ชอบ fetch คือเท่าไหร่?
คำใบ้: ใช้เมธอด "Math.max" ร่วมกับ "..." (spread operator)

// TEST DATA :
const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];
*/

// GOOD LUCK 😀

/*
// 1. เก็บค่าน้ำหนักเฉลี่ยของ "Husky" ไว้ในตัวแปร "huskyWeight"
const huskyWeight = breeds.find(breed => breed.breed === 'Husky').averageWeight;
console.log(huskyWeight);

// 2.  ค้นหาชื่อของสายพันธุ์เดียวที่ชอบทั้ง "running" และ "fetch" แล้วเก็บไว้ในตัวแปร "dogBothActivities"
const dogBothActivities = breeds.find(
  breed =>
    breed.activities.includes('running') && breed.activities.includes('fetch')
);
console.log(dogBothActivities);

// 3. สร้างอาร์เรย์ "allActivities" ซึ่งเก็บกิจกรรมทั้งหมดของทุกสายพันธุ์สุนัข
const allActivities = breeds.flatMap(activities => activities.activities);
console.log(allActivities);

// 4. สร้างอาร์เรย์ "uniqueActivities" ที่เก็บเฉพาะกิจกรรมที่ไม่ซ้ำกัน
const uniqueActivities = [...new Set(allActivities)];
console.log(uniqueActivities);

// 5. มีสายพันธุ์สุนัขหลายตัวที่ชอบว่ายน้ำ สายพันธุ์เหล่านี้ชอบทำกิจกรรมอะไรอีกบ้าง? เก็บ กิจกรรมอื่น ๆ ที่พวกมันชอบทำลงในอาร์เรย์ "swimmingAdjacent" ซึ่งต้องไม่มีค่าซ้ำกัน

const swimmingAdjacent = [
  ...new Set(
    breeds
      .filter(swimming => swimming.activities.includes('swimming'))
      .flatMap(activities => activities.activities)
      .filter(swimming => swimming !== 'swimming')
  ),
];
console.log(swimmingAdjacent);

// 6.ทุกสายพันธุ์มีน้ำหนักเฉลี่ย 10 กิโลกรัมขึ้นไป หรือไม่?
const AverageWeigth = breeds.map(weight => weight.averageWeight >= 10);
console.log(AverageWeigth);

// 7.มีสายพันธุ์ใดที่เป็น "active" หรือไม่? "Active" หมายถึงสายพันธุ์ที่มีกิจกรรม 3 อย่างขึ้นไป
const dogsActive = breeds.map(active => active.activities.length >= 3);
console.log(dogsActive);

// โบนัส:
const dogeFetchMaxweight = Math.max(
  ...breeds
    .filter(fetch => fetch.activities.includes('fetch'))
    .flatMap(weight => weight.averageWeight)
);
console.log(dogeFetchMaxweight);
*/

/*
// เฉลยของอาจาร
// 1.
const huskyWeight = breeds.find(breed => breed.breed === 'Husky').averageWeight;
console.log(huskyWeight);

// 2.
const dogBothActivities = breeds.find(
  breed =>
    breed.activities.includes('fetch') && breed.activities.includes('running')
).breed;

console.log(dogBothActivities);

// 3.
// const allActivities = breeds.map(breed => breed.activities).flat();
const allActivities = breeds.flatMap(breed => breed.activities);
console.log(allActivities);

// 4.
const uniqueActivities = [...new Set(allActivities)];
console.log(uniqueActivities);

// 5.
const swimmingAdjacent = [
  ...new Set(
    breeds
      .filter(breed => breed.activities.includes('swimming'))
      .flatMap(breed => breed.activities)
      .filter(activity => activity !== 'swimming')
  ),
];
console.log(swimmingAdjacent);

// 6.
console.log(breeds.every(breed => breed.averageWeight > 10));

// 7.
console.log(breeds.some(breed => breed.activities.length >= 3));

// Bonus
const fetchWeight = breeds
  .filter(breed => breed.activities.includes('fetch'))
  .map(breed => breed.averageWeight);
const heaviesFetchBreed = Math.max(...fetchWeight);

console.log(fetchWeight);
console.log(heaviesFetchBreed);
*/

/*
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sorting Array
// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);

// return < 0, A, B (keep order)
// return > 0, A, B (switch order)

// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// console.log(movements);
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/

/*
////////////////////////////////////////////////////////////////////////////////////////////////////
// Array Grouping
console.log(movements);

const groupedMovements = Object.groupBy(movements, movement =>
  movement > 0 ? 'deposits' : 'withdrawals'
);
console.log(groupedMovements);

const groupedByActivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return 'very active';
  if (movementCount >= 4) return 'active';
  if (movementCount >= 1) return 'moderate';
  return 'inactive';
});

console.log(groupedByActivity);

// const groupedAccounts = Object.groupBy(accounts, account => account.type);
const groupedAccounts = Object.groupBy(accounts, ({ type }) => type);
console.log(groupedAccounts);
*/

/*
//////////////////////////////////////////////////////////////////////////////////////////////////////
// More Ways Of creating and Filling Arrays
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log([1, 2, 3, 4, 5, 6, 7]);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5));
x.fill(1);
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function (e) {
  e.preventDefault();

  const movementaUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementaUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});
*/

/*
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Non-Destructive Alternatives: toReversed, to Sorted, toSpliced, with

console.log(movements);
// const reversedMov = movements.slice().reverse();
const reversedMov = movements.toReversed();
console.log(reversedMov);
console.log(movements);

// toSorted (sort), toSpliced (splice)

// movements[1] = 2000;
console.log(movements);

const newMovements = movements.with(1, 2000);
console.log(newMovements);
*/

/*
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Array Methods Practice

// 1.หาผลรวมของเงินฝาอย่างเดียว
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, cur, i, arr) => acc + cur, 0);

console.log(bankDepositSum);

// 2.หาจำนวนครั้งที่ฝากเงินตั้งแต่ 1,000 บาท
const numDeposists1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;

console.log(numDeposists1000);

const numDeposists1000_2 = accounts
  .flatMap(acc => acc.movements)
  // .reduce((acc, cur, i, arr) => (cur >= 1000 ? acc + 1 : acc), 0);
  .reduce((acc, cur, i, arr) => (cur >= 1000 ? ++acc : acc), 0);

console.log(numDeposists1000_2);

// Prefixed ++ Operator
let a = 10;
console.log(++a);
console.log(a);

// 3. หาผลรวมแยกกันได้โดยไม่ต้อง Filter ข้อมูลแต่ไปกำหนดเงื่อนไขใน reduce แทน
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(sums);

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4. แปลงข้อความให้อยู่ใน Formating ที่ต้องการ และกำหนดตัวที่เป็นข้อยกเว้น
// this is a nice title -> This Is a Nice Title

const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const capitzalize = str => str[0].toUpperCase() + str.slice(1);
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitzalize(word)))
    .join(' ');
  return capitzalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not to long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Coding Challenge #5
// Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little. Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite. Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).
// Your tasks:
// 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do not create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. Hint: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
// 5. Log to the console whether there is any dog eating exactly the amount of food that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an okay amount of food (just true or false)
// 7. Create an array containing the dogs that are eating an okay amount of food (try to reuse the condition used in 6.)
// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects 😉)

// Hints:
// 1. Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
// 2. Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

// Julia และ Kate กำลังศึกษาพฤติกรรมของสุนัขอยู่ และคราวนี้พวกเธอกำลังศึกษาว่าสุนัขกินมากเกินไปหรือน้อยเกินไปหรือไม่

// การกินมากเกินไปหมายถึง ปริมาณอาหารที่สุนัขกินในปัจจุบันมากกว่าปริมาณที่แนะนำ
// การกินน้อยเกินไปหมายถึง ตรงกันข้ามกับข้างต้น
// การกินในปริมาณที่เหมาะสมหมายถึง ปริมาณอาหารปัจจุบันอยู่ในช่วง ±10% ของปริมาณที่แนะนำ (ดูคำแนะนำด้านล่าง)

// งานที่ต้องทำ:
// 1. วนลูปผ่านอาร์เรย์ dogs ซึ่งเป็นอาร์เรย์ที่มีอ็อบเจ็กต์ของสุนัข และสำหรับสุนัขแต่ละตัว คำนวณปริมาณอาหารที่แนะนำ แล้วเพิ่มเป็นคุณสมบัติใหม่ในอ็อบเจ็กต์ (ห้ามสร้างอาร์เรย์ใหม่ ให้ปรับเปลี่ยนอาร์เรย์เดิมเท่านั้น)
// สูตรคำนวณ: recommendedFood = weight ** 0.75 * 28
// หน่วยเป็นกรัม และน้ำหนักต้องอยู่ในหน่วยกิโลกรัม

// 2. หาสุนัขของ Sarah และแสดงผลทางคอนโซลว่ามันกินมากเกินไปหรือน้อยเกินไป
// คำใบ้: บางตัวมีเจ้าของหลายคน ดังนั้นต้องค้นหา Sarah ในอาร์เรย์ owners

// 3.สร้างอาร์เรย์ใหม่สองอาร์เรย์:
// ownersEatTooMuch → รายชื่อเจ้าของสุนัขที่กินมากเกินไป
// ownersEatTooLittle → รายชื่อเจ้าของสุนัขที่กินน้อยเกินไป

// 4.ล็อกข้อความลงคอนโซล สำหรับแต่ละอาร์เรย์ที่สร้างในข้อ 3
// "Matilda and Alice and Bob's dogs eat too much!"
// "Sarah and John and Michael's dogs eat too little!"

// 5.ล็อกค่า true หรือ false ลงคอนโซล ว่ามีสุนัขตัวไหนกิน พอดีเป๊ะ กับที่แนะนำหรือไม่

// 6.ล็อกค่า true หรือ false ลงคอนโซล ว่ามีสุนัขตัวไหนกินในปริมาณที่เหมาะสม (±10% ของค่าที่แนะนำ) หรือไม่

// 7.สร้างอาร์เรย์ใหม่ที่มีเฉพาะสุนัขที่กินปริมาณอาหารเหมาะสม (ใช้เงื่อนไขจากข้อ 6)

// 8.สร้างสำเนาตื้น (shallow copy) ของอาร์เรย์ dogs แล้วเรียงลำดับตาม ปริมาณอาหารที่แนะนำ จากน้อยไปมาก

// Test data:
const dogs = [
  {
    weight: 22,
    curFood: 250,
    owners: ['Alice', 'Bob'],
  },
  {
    weight: 8,
    curFood: 200,
    owners: ['Matilda'],
  },
  {
    weight: 13,
    curFood: 275,
    owners: ['Sarah', 'John', 'Leo'],
  },
  {
    weight: 18,
    curFood: 244,
    owners: ['Joe'],
  },
  {
    weight: 32,
    curFood: 340,
    owners: ['Michael'],
  },
];

// GOOD LUCK 😀
/*
////////////////////////////////////////////////////
// ทำเองครับผมม
// 1.คำนวณปริมาณอาหารที่แนะนำ และเพิ่มลงในอ็อบเจ็กต์
dogs.map(dog => {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});

console.log(dogs);

// 2.หาสุนัขของ Sarah และตรวจสอบว่ากินมากหรือน้อยเกินไป
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(dogSarah);
console.log(dogSarah.curFood);
console.log(dogSarah.recommendedFood);
console.log(
  `Sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'too much' : 'too little'
  }`
);

// 3.สร้างอาร์เรย์ของเจ้าของที่สุนัขกินมากหรือน้อยเกินไป

const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recommendedFood);

const ownersEatTooLittle = dogs.filter(
  dog => dog.curFood < dog.recommendedFood
);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4.แสดงผลข้อความ
console.log(
  `${ownersEatTooMuch
    .flatMap(dog => dog.owners)
    .join(' and ')} 's dogs eat too much!`
);
console.log(
  `${ownersEatTooLittle
    .flatMap(dog => dog.owners)
    .join(' and ')} 's dogs eat too much!`
);

// 5.ตรวจสอบว่ามีสุนัขที่กินพอดีเป๊ะกับที่แนะนำหรือไม่
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6.ตรวจสอบว่ามีสุนัขที่กินในปริมาณเหมาะสม (±10% ของค่าที่แนะนำ) หรือไม่
const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

console.log(dogs.some(checkEatingOkay));

// 7.สร้างอาร์เรย์ของสุนัขที่กินปริมาณอาหารเหมาะสม
const dogsEatingOkay = dogs.filter(checkEatingOkay);
console.log(dogsEatingOkay);

// 8.สร้างสำเนาของอาร์เรย์ `dogs` และเรียงลำดับตามปริมาณอาหารที่แนะนำ
const sortedDogs = [...dogs].sort(
  (a, b) => a.recommendedFood - b.recommendedFood
);
console.log(sortedDogs);
*/
/*
// เฉลยของอาจาร์ยครับผม
// 1.
dogs.forEach(dog => {
  dog.recommendedFood = Math.floor(dog.weight ** 0.75 * 28);
});
console.log(dogs);

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);

console.log(
  `Sarah's dog eats too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);

// 3.
const ownersTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersTooMuch);
const ownersTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersTooLittle);

// 4.
console.log(`${ownersTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersTooLittle.join(' and ')}'s dogs eat too little!`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6.

const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

console.log(dogs.every(checkEatingOkay));

// 7.
const dogEatingOkay = dogs.filter(checkEatingOkay);
console.log(dogEatingOkay);

// 8.
const dogsGroupedByPortion = Object.groupBy(dogs, dog => {
  if (dog.curFood > dog.recommendedFood) {
    return 'too-much';
  } else if (dog.curFood < dog.recommendedFood) {
    return 'too-little';
  } else {
    return 'exact';
  }
});

console.log(dogsGroupedByPortion);

// 9.
const dogsGroupedByOwners = Object.groupBy(
  dogs,
  dog => `${dog.owners.length}-owners`
);
console.log(dogsGroupedByOwners);

// 10.
const dogsSorted = dogs.toSorted(
  (a, b) => a.recommendedFood - b.recommendedFood
);
console.log(dogsSorted);
*/
