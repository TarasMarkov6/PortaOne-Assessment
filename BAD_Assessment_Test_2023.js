'use strict';
/*
Передмова: 

Код створений із застосуванням JavaScript.

Код працює за наступним алгоритмом:

	- функція findUniqueChar приймає довільний текст, та (опціонально) перелік 
	діапазонів кодів Unicode, з якими потрібно порівнювати символи тексту.
	Для цього у якості аргументів функції передаються ключі об'єкту charUnicodes,
	а значення за ключами (підмасиви) використовуються для порівняння із кодами
	Unicode символів тексту. Число за індексом '0' кожного підмасива відповідає
	старту діапазону, за індексом '1' - його кінцю. За ключем 'UA' об'єкту 
	charUnicodes отримується діапазон кодів символів української абетки, 'RU' - 
	російської.
	Також в об'єкті charUnicodes знаходиться метод addLang (data), завдяки 
	якому можна додати новий діапазон символів - відповідно додати мову (
	в випадку нашого завдання - додаємо англійську 'EN'), яку може інтерпретувати 
	код. Метод приймає вхідні дані у форматі json;
	
	- якщо явно не вказати мову (мови), на відповідність абетки якої (яких) перевіряти 
	текст, то перевірка виконується за усіма діапазонами об'єкту charUnicodes;
	
	- код (символ за символом) зчитує текст та із символів, що входять у вказані 
	діапазони, складає слова, які переміщує в масив. Символи, що не входять в 
	діапазони, при цьому ігноруються. Тому, наприклад, якщо текст англійською 
	мовою, а явно вказано, що зчитувати його потрібно українською, то він буде
	цілком проігнорований;
	
	- далі код в кожному слові масиву знаходить першу літеру, що не повторюється,
	і переміщує в масив унікальних літер;
	
	- в масиві унікальних літер код знаходить першу літеру, що не повторюється серед
	інших літер масиву;
	
	- також код аналізує перелік діапазонів, що передаються у якості аргументів 
	функції findUniqueChar, і якщо такі діапазони відсутні - виводиться відповідне
	сповіщення.
*/

let charUnicodes = {
	UA: [[1040,1065],[1068,1068],[1070,1071],[1030,1031],[1168,1168],[1028,1028]],
	RU: [[1040,1071],[1025,1025]],
	
	addLang (data) {
		let obj = JSON.parse(data);
		for (let lang in obj) {
			this[lang] = obj[lang];
		}
	}
}


/*
основна функція, що приймає довільний текст та (опціонально) перелік мов (серед кодів 
символів яких виконується пошук), та повертає унікальний символ. Якщо мови не вказані - 
пошук ведеться серед усіх мов об'єкта charUnicodes
*/
let findUniqueChar = function (str,...args) {
	let uniqueChars = [];
	let wordsArray = createWordsArray (str,...args);
	for (let word of wordsArray) {
		let wordUniqueChar = findFirstNoneRepeatingChar (word);
		if (wordUniqueChar) uniqueChars.push(wordUniqueChar);
	}
	
	let stringFromUniqueChars = uniqueChars.join('');
	let uniqueChar = findFirstNoneRepeatingChar (stringFromUniqueChars);
	
	return uniqueChar;
}

//-----------------------------------------------------------------------------------------------------------------------------------
//Приклад 1
console.log( findUniqueChar(
`Тестування застосовується для визначення відповідності предмета випробування заданим специфікаціям. До завдань тестування 
не належить визначення причин невідповідності заданим вимогам (специфікаціям). Тестування — один з розділів діагностики.

Тестування застосовується в техніці, медицині, психіатрії, освіті для визначення придатності об'єкта тестування для виконання 
тих чи інших функцій. Якість тестування і достовірність його результатів значною мірою залежить від методів тестування та складу тестів.`
) ); //Текст для прикладу взятий з Вікіпедії. Унікальний символ, який повертає функція - 'и'.


//-----------------------------------------------------------------------------------------------------------------------------------
//Приклад 2
console.log( findUniqueChar(

`The Tao gave birth to machine language.  Machine language gave birth
to the assembler.
The assembler gave birth to the compiler.  Now there are ten thousand
languages.
Each language has its purpose, however humble.  Each language
expresses the Yin and Yang of software.  Each language has its place within
the Tao.
But do not program in COBOL if you can avoid it.
        -- Geoffrey James, "The Tao of Programming"`

) );//Функція повертає '', так як діапазон кодів символів англійської мови відсутній в об'єкті charUnicodes


//-----------------------------------------------------------------------------------------------------------------------------------
//Приклад 3
charUnicodes.addLang ('{"EN": [[65,90]]}'); //додаємо діапазон кодів символів англійської мови в об'єкт charUnicodes

console.log( findUniqueChar(

`The Tao gave birth to machine language.  Machine language gave birth
to the assembler.
The assembler gave birth to the compiler.  Now there are ten thousand
languages.
Each language has its purpose, however humble.  Each language
expresses the Yin and Yang of software.  Each language has its place within
the Tao.
But do not program in COBOL if you can avoid it.
        -- Geoffrey James, "The Tao of Programming"`

) );//Функція повертає 'm'


//-----------------------------------------------------------------------------------------------------------------------------------
//Приклад 4
console.log( findUniqueChar(

`The Tao gave birth to machine language.  Machine language gave birth
to the assembler.
The assembler gave birth to the compiler.  Now there are ten thousand
languages.
Each language has its purpose, however humble.  Each language
expresses the Yin and Yang of software.  Each language has its place within
the Tao.
But do not program in COBOL if you can avoid it.
        -- Geoffrey James, "The Tao of Programming"`,
'UA','DE','FR',

) );//Функція повертає '', так як явно вказано шукати символи серед діапазонів кодів символів української, німецької та французької мов.
/*
Також виводиться сповіщення 'На наступний перелік мов: <<DE,FR>>,- відсутні значення кодів символів в Unicode і тому 
вони будуть проігноровані'
*/


/*
функція повертає масив слів, знайдених в тексті (при цьому ігноруються нелітеральні символи,
а також коди символів мов, які відсутні в об'єкті charUnicodes)  
*/
function createWordsArray (str,...args) {
	let array = [];
	str += ' ';
	let string = str.toUpperCase();
	let charCodeRange = setGeneralCharCodeRange (...args);
	let startValue;
	let endValue;
	
	for (let i=0; i<str.length; i++) {
		let charCode = string.codePointAt(i);
		if ( checkRange (charCodeRange, charCode) ) {
			if (startValue == undefined) {
				startValue = i;
			}
			endValue = i;
		} else {
			if (startValue != undefined) {
				let word = str.slice(startValue,endValue+1);
				array.push(word);
				startValue = null;
			}
		}
	}
	
	return array;
}


/*
функція повертає значення діапазонів кодів сиволів Unicode, за якими виконується перевірка вхідного тексту 
*/
function setGeneralCharCodeRange (...args) {
	let langArr = args;
	let rangeValues = [];
	let optLangs = checkLangs(args);
	let langs = (optLangs.length > 0) ? optLangs : Object.keys(charUnicodes);
	for (let array of Object.entries(charUnicodes)) {
		if ( typeof array[1] != 'function' && langs.includes( array[0] )) rangeValues.push(...array[1])
	}

	return rangeValues;
}


/*
функція перевіряє, чи знаходиться вибраний код символу у відповідному до вибраних мов діапазоні значень Unicode
*/
function checkRange (range, value) {
	for (let array of range) {
		if (value >= array[0] && value <= array[1] ) return true;
	}
	
	return false;
}


/*
функція повертає перший унікальний символ у довільному слові
*/
function findFirstNoneRepeatingChar(string) {
	let chars = {};
	for (let i=0; i<string.length; i++) {
		let charValue = string[i];
		if (chars[charValue] == undefined) {
			chars[charValue] = 1;
		} else {
			chars[charValue]++;
		}
	}
	for (let j=0; j<string.length;j++) {
		if (chars[string[j]] == 1) return string[j];
	}
	
	return ''; //функція повертає '' якщо унікальний символ відсутній
}


/*
функція перевіряє, чи є мови (які явно вказані як аргумент функції findUniqueChar) в 
в об'єкті charUnicodes. Якщо мови відсутні, викидається сповіщення 'На наступний перелік 
мов: <<${мови}>>,- відсутні значення кодів символів в Unicode і тому вони будуть 
проігноровані'. Тоді пошук відбувається без урахування мов, що відсутні в об'єкті. 
Функція повертає масив мов, за виключенням тих, що відсутні в об'єкті
*/
function checkLangs (langs) {
	let abscLangs = [];
	let presLangs = [];
	for (let lang of langs) {
		if (charUnicodes[lang] == undefined) {
			abscLangs.push(lang);
		} else presLangs.push(lang);
	}
	if (abscLangs.length > 0) alert(`На наступний перелік мов: <<${abscLangs}>>,- відсутні значення кодів символів в Unicode і тому вони будуть проігноровані`);
	
	return presLangs;
}