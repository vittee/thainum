# thainum
ไลบรารีสำหรับแปลงจำนวนตัวเลขให้เป็นคำอ่านภาษาไทย

## คุณสมบัติ
- อ่านตัวเลขได้ยาวไม่จำกัด (เฉพาะ input ชนิด `string` เท่านั้น)
- อ่านหน่วยสกุลเงินบาท/สตางค์ได้
- TypeScript Support

## การติดตั้ง

```shell
$ npm install thainum --save
```

## การใช้งาน

`thainum` export function 2 ตัว คือ `text` และ `baht`

```ts
import { text, baht } from "thainum";

console.log(text('1234')); // หนึ่งพันสองร้อยสามสิบสี่
console.log(baht(1234.5)); // หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์
```

# API Reference

- [`text`](#text)
- [`baht`](#baht)

## text

```ts
function text(n: string | number): string;
```

แปลง `n` ให้เป็นคำอ่านภาษาไทย

**ตัวอย่าง**
```ts
console.log(text('1234')); // หนึ่งพันสองร้อยสามสิบสี่
```

## baht

```ts
function baht(n: string | number, options?: BahtReadingOption): string;
```

แปลง `n` ให้เป็นคำอ่านสกุลเงินบาท/สตางค์

**ตัวอย่าง**
```ts
console.log(baht('1234.55')); // หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบห้าสตางค์
```

สำหรับ `options` สามารถระบุการปัดเศษของเศษสตางค์ได้ โดยใช้ property `roundStang`

`roundStang` มีค่า default เป็น `true` ซึ่งจะทำการปัดเศษของสตางค์ หากไม่ต้องการให้ปัดเศษ (ต้องการตัดเศษทิ้ง เอาเฉพาะ 2 หลักแรกของหน่วยสตางค์) ให้กำหนด `roundStang` เป็น `false`

**ตัวอย่าง**
```ts
console.log(baht('1234.558')); // หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบหกสตางค์
console.log(baht('1234.558', false)); // หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบห้าสตางค์
```


# การอ่านตามหลักการอ่านภาษาไทย
`thainum` ใช้การอ่านจำนวนในแบบทางการทหาร หรือ ตามความนิยมทั่วไป 

นั่นคือจะอ่านเลข 1 ในหลักหน่วยว่า `เอ็ด` **เฉพาะที่อยู่หลังเลขหลักสิบที่เป็นเลข 1-9 เท่านั้น**

แต่อ้างอิงจาก **[บทความของสำนักงานราชบัณฑืตยสภา](http://legacy.orst.go.th/?knowledges=หนึ่ง-หรือ-เอ็ด-๕-กรกฎาคม)** ได้อธิบายตามหลักภาษาไทยไว้ว่า ต้องอ่านว่า `เอ็ด` เพียงอย่างเดียวเท่านั้น

ถ้าหากต้องการให้ function `text` และ `baht` อ่านตามหลักการอ่านภาษาไทยอย่างถูกต้อง ก็ให้กำหนด `options` ลงไป โดยระบุ property `formalReading` ให้มีค่าเป็น `true`

**ตัวอย่าง**
```ts
console.log(text('1001', { formalReading: true })); // หนึ่งพันเอ็ด
console.log(baht('1001', { formalReading: true })); // หนึ่งพันเอ็ดบาทถ้วน
```