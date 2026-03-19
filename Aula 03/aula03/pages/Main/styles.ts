import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 70,
        paddingHorizontal: 16,
    },
    flex: {
        display: "flex",
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
        overflow: "visible",
    },
    right: {
        marginLeft: "auto",
    },
    centerItems: {
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    button: {
        backgroundColor: "#6a46eb",
        color: "white",
        borderRadius: 50,
        alignSelf: "flex-start",
    },
    h1: {
        fontSize: 22,
        fontWeight: "bold",
    },
    p: {
        fontSize: 14,
        fontWeight: "normal",
    },
    grayText: {
        color: "#4a4a4a",
    },
    purpleText: {
        color: "#6a46eb",
    },
    topRow: {
        borderBottomColor: "#f0f0f0",
        borderBottomWidth: 2,
        paddingBottom: 16,
        marginBottom: 16,
    },
    activeTab: {
        backgroundColor: "#6a46eb",
    },
    inactiveTab: {
        backgroundColor: "#777",
    },
    buttonTab: {
        backgroundColor: "#6a46eb",
        color: "white",
        borderRadius: 8,
    },
});

export default styles;
