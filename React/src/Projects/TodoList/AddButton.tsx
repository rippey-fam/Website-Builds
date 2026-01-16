export default function AddButton() {
    return (
        <button
            style={{
                width: "100%",
                fontSize: "3rem",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            + <span style={{ fontSize: "1rem" }}>Add Task</span>
        </button>
    );
}
