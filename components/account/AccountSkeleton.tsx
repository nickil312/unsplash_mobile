import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import {SafeAreaView} from "react-native";

export const AccountSkeleton = (props) => (

    <ContentLoader
        speed={2}
        width={365}
        height={164}
        viewBox="0 0 365 164"
        backgroundColor="#C9C5C5"
        foregroundColor="#ecebeb"
        {...props}
    >
        <Circle cx="62" cy="64" r="60" />
        <Rect x="5" y="140" rx="4" ry="4" width="179" height="24" />
    </ContentLoader>

)

