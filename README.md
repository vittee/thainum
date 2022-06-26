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
function baht(n: string | number, roundStang: boolean = true): string;
```

แปลง `n` ให้เป็นคำอ่านสกุลเงินบาท/สตางค์

**ตัวอย่าง**
```ts
console.log(baht('1234.55')); // หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบห้าสตางค์
```

`roundStand` มีค่า default เป็น `true` ซึ่งจะทำการปัดเศษของสตางค์ หากไม่ต้องการให้ปัดเศษ (ต้องการตัดเศษทิ้ง เอาเฉพาะ 2 หลักแรกของหน่วยสตางค์) ให้กำหนด `roundStand` เป็น `false`

**ตัวอย่าง**
```ts
console.log(baht('1234.558')); // หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบหกสตางค์
console.log(baht('1234.558', false)); // หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบห้าสตางค์
```