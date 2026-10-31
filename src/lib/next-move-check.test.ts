import assert from "node:assert/strict";
import { test } from "node:test";
import {
  describeRemainder,
  evaluateCheck,
  formatNaira,
  formatSignedNaira,
  parseNaira,
  type CheckInput,
} from "./next-move-check";

const base: CheckInput = {
  available: "100000",
  costs: [{ id: "rent", name: "Rent", amount: "40000" }],
  noCostsConfirmed: false,
  possibleExpenseName: "",
  possibleExpenseAmount: "",
};

test("formats NGN consistently and distinguishes zero from shortfall", () => {
  assert.match(formatNaira(100000), /^₦100,000$/);
  assert.equal(describeRemainder(0), "₦0 remaining");
  assert.equal(describeRemainder(-10000), "Short by ₦10,000");
  assert.equal(formatSignedNaira(-10000), "−₦10,000");
});

test("calculates commitments and one optional scenario", () => {
  const noScenario = evaluateCheck(base).result;
  assert.deepEqual(noScenario, {
    available: 100000, commitments: 40000, beforeExpense: 60000,
    possibleExpense: null, afterExpense: null,
  });
  const withScenario = evaluateCheck({ ...base, possibleExpenseAmount: "15000" }).result;
  assert.equal(withScenario?.beforeExpense, 60000);
  assert.equal(withScenario?.afterExpense, 45000);
});

test("requires explicit confirmation for an empty cost list", () => {
  const input = { ...base, costs: [] };
  assert.equal(evaluateCheck(input).result, null);
  assert.equal(evaluateCheck({ ...input, noCostsConfirmed: true }).result?.beforeExpense, 100000);
});

test("shows commitment shortfall before a scenario and increases it afterward", () => {
  const input = { ...base, available: "40000", costs: [{ id: "rent", name: "Rent", amount: "50000" }] };
  assert.equal(evaluateCheck(input).result?.beforeExpense, -10000);
  assert.equal(evaluateCheck({ ...input, possibleExpenseAmount: "5000" }).result?.afterExpense, -15000);
});

test("accepts an exact zero result", () => {
  assert.equal(evaluateCheck({ ...base, available: "40000" }).result?.beforeExpense, 0);
});

test("rejects decimal, signed, grouped and zero-positive amounts", () => {
  for (const amount of ["1.50", "-1", "+1", "1,000", "₦100"]) {
    assert.equal(parseNaira(amount, "an amount", true).value, null);
  }
  assert.match(parseNaira("1.50", "an amount", true).error ?? "", /whole-naira.*without decimals/);
  assert.equal(parseNaira("0", "an amount", false).value, null);
  assert.equal(parseNaira("0", "an amount", true).value, 0);
});

test("rejects individually unsafe amounts", () => {
  assert.equal(parseNaira("9007199254740992", "an amount", true).value, null);
  assert.equal(evaluateCheck({ ...base, available: "9007199254740992" }).result, null);
});

test("rejects aggregate cost overflow", () => {
  const input: CheckInput = {
    ...base,
    available: "0",
    costs: [
      { id: "a", name: "One", amount: String(Number.MAX_SAFE_INTEGER) },
      { id: "b", name: "Two", amount: "1" },
    ],
  };
  const evaluation = evaluateCheck(input);
  assert.equal(evaluation.result, null);
  assert.match(evaluation.errors.calculation ?? "", /total costs are too large/);
});

test("rejects a calculated remainder outside the safe-integer range", () => {
  const input: CheckInput = {
    ...base,
    available: "0",
    costs: [{ id: "a", name: "One", amount: String(Number.MAX_SAFE_INTEGER) }],
    possibleExpenseAmount: "1",
  };
  const evaluation = evaluateCheck(input);
  assert.equal(evaluation.result, null);
  assert.match(evaluation.errors.calculation ?? "", /result is too large/);
});

test("invalid and incomplete entered values suppress every result", () => {
  assert.equal(evaluateCheck({ ...base, costs: [{ id: "a", name: "", amount: "5" }] }).result, null);
  assert.equal(evaluateCheck({ ...base, possibleExpenseAmount: "1.5" }).result, null);
  assert.equal(evaluateCheck({ ...base, possibleExpenseName: "Shoes" }).result, null);
});
