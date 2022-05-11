const Papa = require("papaparse");
const _ = require("lodash");
const fs = require("fs");
const os = require("os");
const userHomeDir = os.homedir();

const oldFile = document.getElementById("oldFile");
const newFile = document.getElementById("newFile");
let oldCsv;
let newCsv;

oldFile.onchange = () => {
	try {
		const temp = oldFile.files[0];
		let reader = new FileReader();
		reader.readAsText(temp);
		reader.onload = function () {
			oldCsv = Papa.parse(reader.result, {
				header: true,
			});
			oldCsv = oldCsv.data
				.filter((x) => x.ID)
				.map((row) => {
					Object.keys(row).forEach((key) => {
						if (!row[key]?.trim()) {
							row[key] = undefined;
						}
					});
					return row;
				});
			if (newCsv && oldCsv) {
				merge();
			}
		};
	} catch (e) {
		alert(e);
		process.exit(1);
	}
};

const merge = () => {
	let merged = _.merge(oldCsv, newCsv);
	console.log("merged: ", merged);
	const mergedCsv = Papa.unparse(merged);
	const path = `${userHomeDir}/merged_${new Date().getMilliseconds()}.csv`;
	fs.writeFileSync(path, mergedCsv);
	alert(`Success!

	The newly merged file has been saved to:
	 ${path}`);
	oldFile.value = null;
	newFile.value = null;
};

newFile.onchange = () => {
	try {
		originalNewCsv = {...newCsv};
		const temp = newFile.files[0];
		let reader = new FileReader();
		reader.readAsText(temp);
		reader.onload = function () {
			newCsv = Papa.parse(reader.result, {
				header: true,
			});
			newCsv = newCsv.data
				.filter((x) => x.ID)
				.map((row) => {
					Object.keys(row).forEach((key) => {
						if (!row[key]?.trim()) {
							row[key] = undefined;
						}
					});
					return row;
				});
			if (newCsv && oldCsv) {
				merge();
			}
		};
	} catch (e) {
		alert(e);
		process.exit(1);
	}
};
