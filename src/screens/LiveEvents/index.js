import styles from "./styles.module.scss";
import BaseContainerWithNavbar from "components/BaseContainerWithNavbar";
import HeaderWithHeadline from "components/HeaderWithHeadline";
import { useSelector } from "react-redux";

const LiveEvents = () => {
    const testProp = useSelector((state) => state.event.testProp);
    console.log("testProp :>> ", testProp);
    return (
        <BaseContainerWithNavbar withPaddingTop={true}>
            <HeaderWithHeadline headline="Live Events" />
            {testProp.map((item) => (
                <div>Text herE: {item}</div>
            ))}
        </BaseContainerWithNavbar>
    );
};

export default LiveEvents;
