import {View, Text, useColorScheme, ScrollView} from "react-native";
import styled from "styled-components/native";
import {AccountCollectionsSkeleton} from "../AccountCollectionsSkeleton";
import {useTranslation} from "react-i18next";
export const AccountCollections = () => {
    const currentTheme = useColorScheme()
    const {t} = useTranslation();
    const MainTitle = styled.Text`
  margin-left: 15px;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
      color: ${currentTheme === "dark" ? 'white' : 'black'};

    `;
    return(
        <View>
            <ScrollView>


            <MainTitle>
                {t('Collections')}
            </MainTitle>
            <AccountCollectionsSkeleton style={{
                marginLeft: 5,
                marginTop: 15,

            }}/>
                <AccountCollectionsSkeleton style={{
                    marginLeft: 5,
                    marginTop: 15,

                }}/>

            </ScrollView>
        </View>
    )
}