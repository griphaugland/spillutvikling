import { currency, kills, map, base } from '../index.js';

const scoreCurrency = document.querySelector('#currency');
const scoreBase = document.querySelector('#base');
const scoreRemaining = document.querySelector('#remaining');

export function setScoreboard() {
  scoreCurrency.innerText = `$${currency}`;
  scoreBase.innerText = `${base.hp} hp`;
  scoreRemaining.innerText = `${kills} / ${map.enemies}`;
}

export function updateScoreboardCurrency() {
  scoreCurrency.innerText = `$${currency}`;
}

export function updateScoreboardHealth() {
  scoreBase.innerText = `${base.hp} hp`;
}

export function updateScoreboardKills() {
  scoreRemaining.innerText = `${kills} / ${map.enemies}`;
}
