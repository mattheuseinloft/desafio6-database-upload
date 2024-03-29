import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async all(): Promise<Transaction[]> {
    const transactions = await this.find();

    transactions.forEach(transaction => {
      delete transaction.category_id;
    });

    return transactions;
  }

  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, { value }: Transaction) => sum + value, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((sum, { value }: Transaction) => sum + value, 0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
