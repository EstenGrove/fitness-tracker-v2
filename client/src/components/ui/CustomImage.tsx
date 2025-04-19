import styles from "../../css/ui/CustomImage.module.scss";

type Props = {
	src: string;
	alt?: string;
};

const CustomImage = ({ src, alt = "CustomImage" }: Props) => {
	return (
		<div className={styles.CustomImage}>
			<img src={src} alt={alt} className={styles.CustomImage_img} />
		</div>
	);
};

export default CustomImage;
