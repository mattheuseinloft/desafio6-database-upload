import csvParse from 'csv-parse';
import fs from 'fs';

async function loadCSV(csvFilePath: string): Promise<string[]> {
  const readCSVStream = fs.createReadStream(csvFilePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: string[] = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

async function deleteCSVFile(csvFilePath: string): Promise<void> {
  fs.promises.unlink(csvFilePath);
}

export default {
  loadCSV,
  deleteCSVFile,
};
