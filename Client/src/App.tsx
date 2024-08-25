import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { router } from "./routes/routeConfig.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";

function App() {
	return (
		<AuthProvider>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<RouterProvider router={router} />
			</ThemeProvider>
		</AuthProvider>
	);
}

export default App;
