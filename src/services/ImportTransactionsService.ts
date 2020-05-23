import { Request } from 'express';
import path from 'path';
import csvConfig from '../config/csv';
import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

import AppError from '../errors/AppError';

interface RequestDTO {
  request: Request;
}

class ImportTransactionsService {
  async execute({ request }: RequestDTO): Promise<Transaction[]> {
    if (!request.file) {
      throw new AppError('CSV file could not be uploaded');
    }

    const csvFilePath = path.join(
      uploadConfig.directory,
      request.file.filename,
    );

    const csvData = await csvConfig.loadCSV(csvFilePath);

    const createTransaction = new CreateTransactionService();

    const transactions: Transaction[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const csvLine of csvData) {
      const transaction = await createTransaction.execute({
        title: csvLine[0],
        type: csvLine[1] as 'income' | 'outcome',
        value: Number(csvLine[2]),
        category: csvLine[3],
      });

      transactions.push(transaction);
    }

    await csvConfig.deleteCSVFile(csvFilePath);

    return transactions;
  }
}

export default ImportTransactionsService;
