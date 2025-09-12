import "./App.css";

function App() {
    return (
        <div>
            Hello Everybody!
            <hr />
            <Avatar size={100} />
        </div>
    );
}

export default App;

function Avatar(props) {
    let size = props.size;
    return (
        <div width={size} height={size} className="avatar">
            Avatar {props.size}
        </div>
    );
}
