import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfileScreen from "../screens/ProfileScreen";
import AddScreen from "../screens/AddScreen";
import HomeScreen from "../screens/HomeScreen";
import PlantScreen from "../screens/PlantScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Root() {
  const screenOptions = ({ route }) => ({
    tabBarHideOnKeyboard: true,
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === "Home") iconName = "md-leaf";
      if (route.name === "Add") iconName = "md-add-circle-outline";
      if (route.name === "Profile") iconName = "md-person";
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarStyle: {
      height: 60,
      position: "absolute",
      backgroundColor: "rgba(255, 255, 255, 0.6)",
    },
    tabBarActiveBackgroundColor: "#0b2613",
    tabBarActiveTintColor: "white",
    tabBarInactiveTintColor: "#0b2613",
    tabBarLabelStyle: { marginBottom: 3 },
    tabBarItemStyle: {
      height: 50,
      borderRadius: 5,
      marginVertical: 5,
      marginHorizontal: 2,
    },
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function HomeStack() {
  const options = ({ route }) => ({
    title: route.params.plant.plantName,
    headerStyle: {
      backgroundColor: "#0b2613",
    },
    headerTintColor: "white",
    headerTitleStyle: {
      textAlign: "center",
    },
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={Root}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Plant" component={PlantScreen} options={options} />
    </Stack.Navigator>
  );
}
