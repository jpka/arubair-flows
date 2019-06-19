export const getDataURL = (file) => {
	const reader = new FileReader();
	const ret = new Promise((resolve, reject) => {
		//@ts-ignore
		reader.onload = (e) => resolve(e.target.result);
	});
	reader.readAsDataURL(file);

	return ret;
}