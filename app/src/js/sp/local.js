$(function () {
	// スプラッシュ画面
	splash();

	// 横向けにしたときに文言表示
	showMsgLandscape();

	// タイプライターアニメーション
	typewriter();

	// スライダー
	slider();

	// gNavスティッキー化
	gNavStickey();

	// スムーススクロール
	$('.scroll').smoothScroll({
		positioning: -60,
		callback: function () {
			//全要素からフォーカスを外す
			document.activeElement.blur();
		}
	});
});

/**
* スプラッシュ画面
*/
function splash() {
	$('#js-splash').each(function () {
		var $window = $(window);
		var windowHeight = $window.height();
		var windowWidth = $window.width();
		var $container = $(this);
		var $logo = $container.find('.splash__txt');
		var $cover1 = $container.find('#js-spash__cover1');
		var $cover2 = $container.find('#js-spash__cover2');
		var DURATION = 600;
		var CLASS_START = 'is-start';

		// ロゴを中央に配置
		$logo.css({
			top: windowHeight / 2,
			left: windowWidth / 2
		});

		$cover1.delay(500).velocity({
			width: '100%'
		}, {
			duration: DURATION,
			easing: [.96,0,.19,.97],
			complete: function () { // コールバック
				// 非同期処理させるため
				setTimeout(function () {
					addClassScroll();
				}, 100);
				$cover2.velocity({
					width: '100%'
				}, {
					duration: DURATION,
					easing: [.96,0,.19,.97],
					complete: function () { // コールバック
						// 縦スクロール解除
						$('body').addClass(CLASS_START);
						// FV表示
						$('.heroArea').addClass(CLASS_START);
						window.scrollTo(0,0);
						$container.delay(800).velocity({
							opacity: 0
						}, (DURATION * .5), function() { // コールバック
							$(this).hide();
							$('.header').addClass(CLASS_START);
							setTimeout(function () {
								$('.mainTxt').addClass(CLASS_START);
								// タイプライターをタイマー実行
								setClassTimer();
							}, 500);
						});
					}
				});
			}
		});
	});
}


/**
* スクロール後、特定の高さになったらクラス追加
*/
function addClassScroll() {
	var $target = $('.js-addclassScroll');
	var $window = $(window);
	var windowHeight = $window.innerHeight();
	var SHOW_HEIGHT = 80; // 表示される高さ
	var offsetTopArray = []; // 各要素のTOP値格納用の配列
	var CLASS_ACTIVE = 'is-start';
	var scrollTop = 0; // スクロールの値格納用

	// 各要素のTOP値を取得
	$target.each(function() {
		offsetTopArray.push(parseInt($(this).offset().top, 10));
	});

	/**
	* 現在のスクロール量と各要素のTOP地の比較してクラスを付与する関数
	*/
	function setClass() {
		scrollTop = $window.scrollTop();
		$target.each(function (i) {
			if (scrollTop > (offsetTopArray[i] + SHOW_HEIGHT) - windowHeight) {
				$(this).addClass(CLASS_ACTIVE);
			}
		});
	}
	$window.on('scroll resize', _.throttle(setClass, 100));
}


/**
* MV用にアニメーション時間をずらす
*/
function setClassTimer() {
	$('.js-textTypoMulti').each(function () {
		var $item = $(this).find('.js-textTypo');
		var totalTextLength = 0;
		var CLASS_ACTIVE = 'is-start';

		$item.each(function (i) {
			var $this = $(this);
			var duration = $this.data('duration');
			totalTextLength += $this.text().length; // 合計の文字数を加算
			var time = totalTextLength * duration;
			// 最初だけ待ち時間なし
			if (i === 0) {time = 0;}
			setTimeout(function () {
				$this.addClass(CLASS_ACTIVE);
			}, time);
		});
	});
}


/**
* landscape（横向き）時にメッセージ表示
*/
function showMsgLandscape() {
	var ua = navigator.userAgent.toLowerCase();
	var $target = $('#js-deviceMode');
	var CLASS_ACTIVE = 'is-active';
	var reloadFlag = false; // リロードするか否かのフラグ

	function checkDo() {
		if(ua.indexOf('iphone') > 0 || ua.indexOf('android') > 0) {
			// landscape表示の時
			if(window.innerWidth >= window.innerHeight) {
				$target.addClass(CLASS_ACTIVE);
				reloadFlag = true;
			}
			// landscape表示後にportrait表示にした時
			else if (reloadFlag){
				location.reload();
			}
		}
	}
	$(window).on('load resize', function() {
		checkDo();
	});
}


/**
* タイプライター風アニメーション
*/
function typewriter() {
	var $target = $('.js-typeWriter');

	$target.each(function () {
		var $this = $(this);
		var ary = $this.text().split(''); // テキストを1文字ずつ配列に格納
		var htm = '';
		var aryLength = ary.length;
		var duration = $(this).data('duration');
		var durationTime = parseInt(aryLength * duration + 500, 10); // 最後の文字のアニメーション開始までの時間を取得用
		for (var i = 0; i < aryLength; i++) {
			htm += '<span style="animation-delay:' + (i * duration + 500) + 'ms;">' + ary[i] + '</span>';
		}
		// html書き換え
		$this.html(htm).addClass('js-textTypo');
	});
}


/**
* worksスライダー
*/
function slider() {
	$(window).on('load', function () {
		/*================================
		* 変数の定義
		================================*/
		var $container = $('#js-slider');
		var $slideGroupBlock = $container.find('.slider__picBlock');
		var $slideGroupBlockInner = $slideGroupBlock.find('.slider__picBlockInner');
		var $slideGroup = $slideGroupBlockInner.find('.slider__picList');
		var $slide = $slideGroup.find('.slider__picItem');
		var $slideAnchor = $slide.find('.slider__picAnchor');
		var $navBtns = $container.find('.slider__arrow');
		var $indicator = $container.find('.slider__indicator');
		var $txtGroup = $container.find('.slider__txtList');
		var $txt = $txtGroup.find('.slider__txtItem');

		var slideWidth = $slide.find('img').width(); // 画像の横幅
		var MARGIN_BETWEEN_SLIDE = 15; // スライド同士の間隔
		var slideCount = $slide.length; // スライドの数
		var currentIndex = 0; // 現在のスライドのインデックス
		var nextIndex; // 次のスライドのインデックス
		var indicatorHTML = ''; // インジケーター用のHTML

		var CLASS_ACTIVE = 'is-active'; // アクティブ時に付与するクラス名
		var DURATION = 500; // アニメーション時間
		var EASING = [.28,.61,.49,.98]; // イージング

		var threshold = 30; // スワイプ発生とみなす距離
		var startX, currentX; // 座標を保存するための変数
		var swipeFlag = false; // スワイプ検知休止状態か否かのフラグ
		var touchFlag = false; // タッチ中か否かのフラグ

		/*================================
		* 関数の定義
		================================*/

		/**
		* 初期化の関数
		*/
		function initSlider() {
			// 画像スライドグループの高さ設定
			$slideGroupBlockInner.height($slide.height());
			// インジケータを作成
			makeIndicator();
			// テキストエリアの高さ設定
			setTxtHeight();
			// 各スライドとナビ位置を設定
			setNavSlidePosition();
			// クローン作成
			makeClone();
			// ナビ、画像スライド、テキストスライドの状態を更新
			upDateClass([$indicator.find('a'), $slide, $txt], currentIndex);
		}

		function setNavBtnPosition() {
			var prevBtn = $navBtns.find('.slider__arrowItem--prev a');
			var nextBtn = $navBtns.find('.slider__arrowItem--next a');
		}

		/**
		* インジケーターの作成関数
		*/
		function makeIndicator() {
			for(var i = 0; i < $slide.length; i++) {
				indicatorHTML += '<li><a href="#">●</a></li>';
			}
			//生成したインジケーター用のHTMLを挿入
			$indicator.append($(indicatorHTML));
		}

		/**
		* テキストスライドグループの高さ設定関数
		*/
		function setTxtHeight() {
			var txtHeightArray = new Array();
			var txtMaxHeight = 0;

			// 各テキストブロックの高さを配列に格納
			for(var i = 0; i < $txt.length; i++){
				txtHeightArray.push(parseInt($txt.eq(i).height(), 10));
			}
			// 高さの最大値を取得
			txtMaxHeight = Math.max.apply(null, txtHeightArray);
			$txtGroup.height(txtMaxHeight);
		}

		/**
		* 各スライドの位置設定関数
		*/
		function setNavSlidePosition() {
			var windowWidth = $(window).width();
			var prevBtn = $navBtns.find('.slider__arrowItem--prev a');
			var nextBtn = $navBtns.find('.slider__arrowItem--next a');

			// ウィンドウと画像の余白幅（片側）
			var marginWindow = parseInt((windowWidth - slideWidth) / 2, 10);

			prevBtn.css({
				left: parseInt(((marginWindow / 2) - 12), 10)
			});
			nextBtn.css({
				right: parseInt(((marginWindow / 2) - 12), 10)
			});

			//各スライドごとに実行
			for(var i = 0; i < $slide.length; i++) {
				//スライドの位置設定
				$slide.eq(i).css({ left: (i + 1) * marginWindow + (i * (slideWidth - marginWindow + MARGIN_BETWEEN_SLIDE)) + 'px' });
			}
		}

		/**
		* クローン作成の関数
		*/
		function makeClone() {
			var $slidesCloneWrap = $('<ul class="slider__picList slider__picList--clone"></ul>'); //クローンを包む要素
			var $slidesClone = $slideGroup.contents().clone();
			var $clone_1 =  $slidesCloneWrap.append($slidesClone);
			var $clone_2 = $clone_1.clone();

			//クローンをそれぞれ前後に挿入、ポジション設定
			$clone_1
				.insertBefore($slideGroup)
				.css({left : -((slideWidth * slideCount) + (MARGIN_BETWEEN_SLIDE * slideCount))});
			$clone_2
				.insertAfter($slideGroup)
				.css({left : (slideWidth * slideCount) + (MARGIN_BETWEEN_SLIDE * slideCount)});
		}

		/**
		* 任意のスライドを表示する関数
		*/
		function goToSlide(index) {
			var leftNum = 0;

			/* 対象のスライドのleft値を取得
			-----------------------------*/
			//最後のスライドからさらに次のインデックスだったら
			if (index >= slideCount) {
				leftNum =  -(index * (slideWidth + MARGIN_BETWEEN_SLIDE));
			}
			//最初のスライドからさらに前のインデックスだったら
			else if (index < 0) {
				leftNum =  -(index * (slideWidth + MARGIN_BETWEEN_SLIDE));
			}
			else {
				leftNum = -(index * (slideWidth + MARGIN_BETWEEN_SLIDE));
			}
			//スライドグループをアニメーションで移動
			$slideGroupBlockInner.velocity('stop').velocity({
				left: leftNum
			}, DURATION, EASING, function () {
				if (index >= slideCount){
					$slideGroupBlockInner.css('left', 0); // 1枚目の位置に戻す
					index = 0;
				} else if (index < 0) {
					$slideGroupBlockInner.css('left', -(slideWidth * (slideCount - 1) + MARGIN_BETWEEN_SLIDE * (slideCount - 1))); // 最後の枚数の位置に戻す
					index = slideCount - 1;
				}
				//ナビとスライドの状態を更新
				upDateClass([$indicator.find('a'), $slide, $txt], index);
				currentIndex = index;
			});
		}

		/**
		* スワイプのチェック関数
		*/
		function evalSwipe() {
			// 右スワイプ時
			if((startX + threshold) < currentX) {
				swipeFlag = true;
				nextIndex = currentIndex - 1;
				// もし最初のスライドより前の、さらに前のインデックスだったら最後のインデックスに戻る
				if (nextIndex < -1) {
					nextIndex = slideCount - 1;
				}
				goToSlide(nextIndex);
			}
			// 左スワイプ時
			if((startX - threshold) > currentX) {
				swipeFlag = true;
				// もし最後のスライドより後の、さらに後のインデックスだったら最初のインデックスに戻る
				nextIndex = (currentIndex + 1) % (slideCount + 1);
				goToSlide(nextIndex);
			}
		}

		/**
		* アクティブの要素にクラスを付与、非アクティブの要素はクラス削除する関数
		*/
		function upDateClass(ary, index) {
			for(var i = 0; i < ary.length; i++) {
				ary[i].removeClass(CLASS_ACTIVE).eq(index).addClass(CLASS_ACTIVE);
			}
		}

		/*================================
		* イベントの設定
		================================*/
		// 初期化実行
		initSlider();

		// スライドをスワイプ時
		$slideGroupBlock
			.on('touchstart', function(e) {
				// オリジナルイベントのタッチ情報の配列を取得
				var touches = e.originalEvent.touches;
				// 2本指以上でのタッチだったら以降の処理キャンセル
				if(touches.length > 1) {
					return;
				}
				// タッチ情報の詳細
				var touchInfo = touches[0];
				// タッチしたX座標を取得
				startX = touchInfo.pageX;
				// タッチ中のフラグをオン
				touchFlag = true;
			})
			.on('touchmove', function(e) {
				// ページスクロール、パンの挙動を止める
				e.preventDefault();
				// タッチ開始後かつスワイプ中でなければ以降の処理実行
				if(!touchFlag) return;
				if(swipeFlag) return;
				var touchInfo = e.originalEvent.touches[0];
				currentX = touchInfo.pageX;
				evalSwipe();
			})
			.on('touchend touchcancel', function(e) {
				if(!touchFlag) {
					return;
				}
				swipeFlag = false;
				touchFlag = false;
				//window.open().location.href = 'http://www.yahoo.co.jp/';
			});

		// スライドをクリック時
		$('.slider__picAnchor').on('click', function (e) {
			// アクティブ状態のスライドでなければクリックキャンセル
			if(!$(this).parent().parent().hasClass(CLASS_ACTIVE)) {
				e.preventDefault();
			}
		});

		// 矢印をクリック時
		$navBtns.on('click', 'a', function(e) {
			e.preventDefault();

			var $this = $(this);

			//prevボタンをクリックした場合
			if($this.parent().hasClass('slider__arrowItem--prev')) {
				nextIndex = currentIndex - 1;
				// もし最初のスライドより前の、さらに前のインデックスだったら最後のインデックスに戻る
				if (nextIndex < -1) {
					nextIndex = slideCount - 1;
				}
				goToSlide(nextIndex);
			}
			//nextボタンをクリックした場合
			if($this.parent().hasClass('slider__arrowItem--next')) {
				// もし最後のスライドより後の、さらに後のインデックスだったら最初のインデックスに戻る
				nextIndex = (currentIndex + 1) % (slideCount + 1);
				goToSlide(nextIndex);
			}
		});

		// インジケーターをクリック時
		$indicator.find('a').on('click', function(e) {
			e.preventDefault();
			if ($(this).hasClass(CLASS_ACTIVE)) {
				return;
			}
			goToSlide($(this).parent().index());
		});
	});
}


/**
* gNav スティッキー化
*/
function gNavStickey() {
	$('#js-gNav').each(function () {
		var $window = $(window);
		var $gNav = $(this);
		var gNavHeight = $gNav.innerHeight(); // gNavの高さ
		var fixPos = $window.height() - gNavHeight; // stickeyになる位置
		var CLASS_FIX = 'is-fixed';
		var stickyFlag = true;

		function setStickey() {
			// スクロール量がgNavのデフォルトの位置より大きくなったら
			if ($window.scrollTop() >= fixPos && stickyFlag === true) {
				$gNav.addClass(CLASS_FIX);
				stickyFlag = false;
			} else if ($window.scrollTop() < fixPos && stickyFlag === false) {
				$gNav.removeClass(CLASS_FIX);
				stickyFlag = true;
			}
		}

		$window
			// 間引き
			.on('scroll', _.throttle(setStickey, 100))
			// リサイズが発生したらstickyになる位置を再取得
			.on('resize', function () {
				fixPos = $window.height() - gNavHeight;
			})
			.trigger('scroll');
	});
}


/**
* スムーススクロール
*/
$.fn.smoothScroll = function (options) {
	var hrefData = '',
		targetPos = 0,
		targetObj = '';

	var defaults = {
		easing : 'swing',
		duration : 400,
		positioning : 0,
		callback : function () {}
	};
	var setting = $.extend(defaults, options);

	if (navigator.userAgent.match(/webkit/i)) {
		targetObj = 'body';
	} else {
		targetObj = 'html';
	}
	$(this).on('click', function (event) {
		hrefData = $(this).attr('href');
		if (hrefData.indexOf('#') !== 0 || $(hrefData).length === 0) { return; }
		event.preventDefault();
		targetPos = $(hrefData).offset().top + setting.positioning;
		$(targetObj).animate({
			scrollTop : targetPos
		}, setting.duration, setting.easing, setting.callback);
	});
};
