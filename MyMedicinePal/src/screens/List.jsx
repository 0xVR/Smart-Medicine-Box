import { View, Text, ScrollView, StyleSheet, Button, SafeAreaView, Dimensions, Pressable } from 'react-native'
import CustomSquareButton from '../components/buttons/CustomSquareButton';
import AlarmClocksList from '../components/AlarmClocksList';
import { React, useEffect, useState } from 'react'
import { Database } from "../../api/Database";
import Modal from "react-native-modal";
import { Audio } from 'expo-av';

const List = ({ navigation }) => {

    const [alarms, setAlarms] = useState([])

    useEffect(() => {
        navigation.addListener('focus', () => {
            setAlarms([])
            Database.getAll().then((all) => {
                console.log(JSON.parse(all));

                const storedAlarms = JSON.parse(all)
                storedAlarms.rows._array.forEach(alarm => setAlarms(prevState => [...prevState, alarm]))
            });
        });
    }, []);



    useEffect(() => console.log(alarms), [alarms])

    const deleteAlarm = (id) => {
        setAlarms(() => alarms.filter(alarm => alarm.id !== id));
        Database.remove(id);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleModal = () => {
        if (!isModalVisible) {
            setTimeout(async () => {
                setIsModalVisible(() => !isModalVisible);
                const { sound } = await Audio.Sound.createAsync(require('../../assets/wolf.mp3'));
                await sound.playAsync();
            }, 60000)

        } else {
            setIsModalVisible(() => !isModalVisible);
        }
    }

    return (
        <View style={theme.container}>
            <Pressable onPress={handleModal}>
                <Text style={{color:"#f0f2f5", fontSize:25}}>HELLOOOO</Text>
            </Pressable>
            <Modal isVisible={isModalVisible}>
                <View style={theme.container}>
                    <Text style={{fontSize:25}}>Emergency</Text>
                    <Text style={{fontSize:25}}>Hadi Zaidi did not take his medication</Text>
                    <Button title="OK" onPress={handleModal}></Button>
                </View>
            </Modal>
            <ScrollView style={{ flexGrow: 1, width: '100%', height: '100%' }}>

                <AlarmClocksList alarms={alarms} remove={deleteAlarm} />

            </ScrollView>
            <View style={theme.button} >
                <CustomSquareButton title={"Add alarm"} onPress={() => navigation.navigate('creator')} />
            </View >
        </View>
    )
}

const theme = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f2f5' },
    panel: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    button: { position: 'absolute', bottom: 70, left: Dimensions.get('window').width / 2 - 110 },
    colors: { black: '#000', white: 'white' },

});

export default List;