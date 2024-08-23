import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { router } from "./routes/routeConfig.tsx";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}

export default App;
