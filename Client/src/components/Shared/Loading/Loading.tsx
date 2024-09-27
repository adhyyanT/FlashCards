import styles from "./Loading.module.css";

const Loading = () => {
	return (
		<div className="flex justify-center items-center w-full h-full">
			<div className={styles.ldsRoller}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default Loading;
