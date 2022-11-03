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
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === "Home") iconName = "md-leaf";
      if (route.name === "Add")
        (iconName = "md-add-circle-outline"), (size = 40);
      if (route.name === "Profile") iconName = "md-person";

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarStyle: {
      height: 50,
    },
    tabBarLabelStyle: {
      color: "red",
    },
    tabBarActiveBackgroundColor: "grey",
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
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={Root}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Plant" component={PlantScreen} />
    </Stack.Navigator>
  );
}
