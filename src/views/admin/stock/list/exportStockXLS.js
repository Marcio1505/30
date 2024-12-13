import XLSX from 'xlsx';

const exportStockXLS = (stockProducts) => {
  const header = ['id'];

  const body = stockProducts.map((product) => {
    return {
      id: product.id,
    };
  });

  const ws = XLSX.utils.json_to_sheet(body, { header });
  const wb = XLSX.utils.book_new();
  const getFileName = () => `estoque`;
  XLSX.utils.book_append_sheet(wb, ws, getFileName());
  XLSX.writeFile(wb, `${getFileName()}.xlsx`);
};

export { exportStockXLS };
