import { useTodoListContext, TodoItem } from "./useTodoList";

export default function AddButton() {
    const { list, updateItem, addItem } = useTodoListContext();
    return (
        <button
            style={{
                width: "100%",
                fontSize: "3rem",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                onClick={() => {
                    const itemName = prompt("New Item Name:") || "New String";
                    addItem({
                        id: list.length,
                        title: itemName,
                        complete: false,
                    });
                }}
            >
                + <span style={{ fontSize: "1rem", marginTop: "5px" }}>Add Task</span>
            </div>
        </button>
    );
}
