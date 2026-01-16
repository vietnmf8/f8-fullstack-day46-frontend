import { useEffect } from "react";
import { useState } from "react";

function App() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [bypassData, setBypassData] = useState(null);

    // Lấy BASE_API từ biến môi trường
    const BASE_API = import.meta.env.VITE_BASE_API || "http://localhost:3000";

    /* Lấy danh sách task khi load trang */
    const fetchTasks = async () => {
        try {
            const res = await fetch(`${BASE_API}/api/tasks`);
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            console.error("Lỗi fetch:", err);
        }
    };

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Thêm task mới */
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        try {
            const res = await fetch(`${BASE_API}/api/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: inputValue }),
            });
            if (res.ok) {
                setInputValue("");
                fetchTasks();
            }
        } catch (err) {
            console.error("Lỗi add:", err);
        }
    };

    /* Toggle trạng thái hoàn thành (PUT) */
    const handleToggle = async (task) => {
        try {
            await fetch(`${BASE_API}/api/tasks/${task.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isCompleted: !task.isCompleted }),
            });
            fetchTasks();
        } catch (err) {
            console.error("Lỗi update:", err);
        }
    };

    /* Xóa task (DELETE) */
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${BASE_API}/api/tasks/${id}`, {
                method: "DELETE",
            });
            if (res.ok) fetchTasks();
        } catch (err) {
            console.error("Lỗi delete:", err);
        }
    };

    /*  Test Bypass CORS */
    const testBypass = async () => {
        const target = "https://api-gateway.fullstack.edu.vn/api/analytics";
        try {
            const res = await fetch(`${BASE_API}/bypass-cors?url=${target}`);
            const data = await res.json();
            setBypassData(data);
        } catch (err) {
            console.error("Bypass failed:", err);
        }
    };

    /* JSX */
    return (
        <div className="p-8 max-w-md mx-auto font-sans">
            <h1 className="text-2xl font-bold mb-4">Todo App (Native Node)</h1>

            {/* Input thêm mới */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                <input
                    type="text"
                    className="flex-1 border p-2 rounded"
                    placeholder="Nhập task mới..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Thêm
                </button>
            </form>

            {/* Danh sách Tasks */}
            <ul className="space-y-3">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className="flex items-center justify-between p-3 border rounded shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => handleToggle(task)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <span
                                className={
                                    task.isCompleted
                                        ? "line-through text-gray-400"
                                        : ""
                                }
                            >
                                {task.title}
                            </span>
                        </div>
                        <button
                            onClick={() => handleDelete(task.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                            Xóa
                        </button>
                    </li>
                ))}
            </ul>

            {/* Phần Test Bypass */}
            <div className="mt-10 pt-6 border-t">
                <button
                    onClick={testBypass}
                    className="bg-gray-800 text-white px-4 py-2 rounded text-sm mb-4 w-full"
                >
                    Test Bypass CORS (Analytics API)
                </button>
                {bypassData && (
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(bypassData, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}

export default App;
