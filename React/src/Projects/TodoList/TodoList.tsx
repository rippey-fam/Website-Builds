import { useTodoList } from "./useTodoList";
export default function TodoList() {
    const { list, updateItem } = useTodoList();
    let lastChecked = false;
    return (
        <ul>
            {list
                .sort((a, b) => a.complete - b.complete)
                .map((item, key) => {
                    return (
                        <li key={key}>
                            <label
                                style={{
                                    userSelect: "none",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={item.complete}
                                    onChange={(ev) => {
                                        updateItem(item, { complete: ev.target.checked });
                                    }}
                                />{" "}
                                {item.title}
                            </label>
                        </li>
                    );
                })}
        </ul>
    );
}
