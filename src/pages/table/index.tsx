import CanvasTable from '@/compontents/canvas-table';
import './index.scss';
const App = () => {
    // 生成测试数据
    const generateData = (rows: number, cols: number) => {
        return Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => `R${row} C${col}`));
    };

    const columns = Array.from({ length: 50 }, (_, i) => ({
        width: 120,
        title: `Column ${i + 1}`,
        key: `col${i}`
    }));

    const data = generateData(10000, 50).map((row) =>
        row.reduce((obj, val, idx) => {
            obj[`col${idx}`] = val;
            return obj;
        }, {} as Record<string, string>)
    );

    return (
        <div className="table">
            {data.length}
            <CanvasTable data={data} columns={columns} rowHeight={32} headerHeight={40} />
        </div>
    );
};

export default App;
