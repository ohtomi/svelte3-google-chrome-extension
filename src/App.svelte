<script>
	import { createSettings } from "./settings";
	import Formatter from "./Formatter.svelte";

	const settings = createSettings();
	settings.load();

	function addFormat(name, value) {
		settings.add(name, value);
	}

	function updateFormat(name, value) {
		settings.update(name, value);
	}

	function removeFormat(name, value) {
		settings.remove(name, value);
	}

	// ツールチップの表示状態
	let show = false;

	function copyWebPageInfo(myFormat) {
		show = false;

		// スクリプトが参照する変数を宣言してフォーマットを指定する
		const prepCode = {
			code: `var formatFromPopup = '${myFormat}';`,
		};

		// ウェブページの情報をクリップボードにコピーする
		const mainCode = {
			file: "content_script.js",
		};

		// ウェブページにコードとスクリプトを送り込む
		chrome.tabs.executeScript(null, prepCode, () => {
			chrome.tabs.executeScript(null, mainCode);
			show = true;
			setTimeout(() => {
				show = false;
			}, 3000);
		});
	}
</script>

<style>
	main {
		min-width: 240px;
		max-width: 240px;
		min-height: 150px;
		max-height: 400px;
		overflow-y: scroll;
	}

	.tooltip {
		position: relative;
		display: inline-block;
		border-bottom: 1px dotted black;
	}

	.tooltip .tooltiptext {
		visibility: hidden;
		width: 200px;
		background-color: black;
		color: #fff;
		text-align: center;
		border-radius: 6px;
		position: absolute;
		z-index: 1;
		top: 100%;
		left: 50%;
	}

	.tooltip .tooltiptext.show {
		visibility: visible;
	}

	.button-container {
		padding: 0 10px;
	}

	.button-container div:last-child {
		margin-bottom: 10px;
	}
</style>

<main>
	<div><span>ウェブページの情報を読み取る</span></div>
	<div class="tooltip">
		<span class="tooltiptext" class:show>クリップボードにコピーしました。</span>
	</div>
	<div class="button-container">
		{#each $settings as setting}
			<div>
				<Formatter
					name={setting.name}
					value={setting.value}
					on:copy={(e) => copyWebPageInfo(e.detail.value)}
					on:update={(e) => updateFormat(e.detail.name, e.detail.value)}
					on:remove={(e) => removeFormat(e.detail.name)} />
			</div>
		{/each}
		<hr />
		<div>
			<Formatter
				isNew={true}
				on:add={(e) => addFormat(e.detail.name, e.detail.value)} />
		</div>
	</div>
</main>
