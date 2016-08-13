$(function () {
	splash();

	addClassScroll();

	typewriter();

	slider();

	gNavStickey();

	$('.scroll').smoothScroll({
		positioning: -80,
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
						$window.scrollTop(0);
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
	$('body').each(function () {
		var $target = $('.js-addclassScroll');
		var SHOW_HEIGHT = 150; // 表示される高さ
		var CLASS_ACTIVE = 'is-start';

		$(window).on('load scroll resize', function () {
			var $window = $(this);
			var scrollTop = $window.scrollTop();
			var windowHeight = $window.innerHeight();

			$target.each(function () {
				var $thisArea = $(this);
				var areaOffsetTop = $thisArea.offset().top;
				if (scrollTop > (areaOffsetTop + SHOW_HEIGHT) - windowHeight) {
					$thisArea.addClass(CLASS_ACTIVE);
				}
			});
		});
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
* MV用にアニメーション時間をずらす
*/
function setClassTimer() {
	$('.js-textTypoMulti').each(function () {
		var $item = $(this).find('.js-textTypo');
		var totalTextLength = 0;
		var CLASS_ACTIVE = 'is-start';

		$item.each(function (i) {
			var $this = $(this);
			var duration = $(this).data('duration');
			totalTextLength += $(this).text().length; // 合計の文字数を加算
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
* worksスライダー
*/
function slider() {
	//スライダー
	$('#js-slider').each(function () {
		/*================================
		* 変数の定義
		================================*/
		var $container = $(this);
		var $slideGroupWrap = $container.find('.slider__listWrap');
		var $slideGroup = $slideGroupWrap.find('.slider__list');
		var $slide = $slideGroup.find('.slider__item');
		var $navBtns = $container.find('.slider__arrow');
		var $indicator = $container.find('.slider__indicator');

		var slideCount = $slide.length; // スライドの数
		var currentIndex = 0; // 現在のスライドのインデックス
		var nextIndex; // 現在のスライドのインデックス
		var indicatorHTML = ''; // インジケーター用のHTML

		var CLASS_ACTIVE = 'is-active'; // アクティブ時に付与するクラス名
		var DURATION = 500; // アニメーション時間
		var POSITION_LEFT_NUM = 850; // 各スライドのleft位置
		var EASING = [.28,.61,.49,.98]; // イージング

		/*================================
		* 関数の定義
		================================*/

		/**
		* 初期化の関数
		*/
		function initSlider() {
			//各スライドごとに実行
			$slide.each(function (i) {
				//インジケーター用htmlの生成
				indicatorHTML += '<li class="slider__indicatorItem"><a href="#">●</a>';
				//スライドの位置設定
				$(this).css({ left: i * POSITION_LEFT_NUM + 'px' });
			});

			//生成したインジケーター用のHTMLを挿入
			$indicator.append($(indicatorHTML));

			//クローン作成
			makeClone();

			//ナビとスライドの状態を更新
			upDateNavSlide(currentIndex);
		}

		/**
		* クローン作成の関数
		*/
		function makeClone() {
			var $slidesCloneWrap = $('<ul class="slider__list slider__list--clone"></ul>'); //クローンを包む要素
			var $slidesClone = $slideGroup.contents().clone();
			var $clone_1 =  $slidesCloneWrap.append($slidesClone);
			var $clone_2 = $clone_1.clone();

			//クローンをそれぞれ前後に挿入、ポジション設定
			$clone_1
				.insertBefore($slideGroup)
				.css({left : POSITION_LEFT_NUM * slideCount * -1});
			$clone_2
				.insertAfter($slideGroup)
				.css({left : POSITION_LEFT_NUM * slideCount });
		}

		/**
		* 任意のスライドを表示する関数
		*/
		function goToSlide(index) {
			var leftNum;

			/* 対象のスライドのleft値を取得
			-----------------------------*/
			//最後のスライドからさらに次のインデックスだったら
			if (index >= slideCount) {
				leftNum =  POSITION_LEFT_NUM * slideCount * -1;
			}
			//最初のスライドからさらに前のインデックスだったら
			else if (index < 0) {
				leftNum =  POSITION_LEFT_NUM;
			}
			else {
				leftNum = parseInt($slide.eq(index).css('left')) * -1;
			}
			//スライドグループをアニメーションで移動
			$slideGroupWrap.velocity('stop').velocity({
				left: leftNum
			}, DURATION, EASING, function () {
				if (index >= slideCount){
					$slideGroupWrap.css('left', 0); // 1枚目の位置に戻す
					index = 0;
				} else if (index < 0) {
					$slideGroupWrap.css('left', POSITION_LEFT_NUM * (slideCount - 1) * -1); // 最後の枚数の位置に戻す
					index = slideCount - 1;
				}
				//ナビとスライドの状態を更新
				upDateNavSlide(index);
				currentIndex = index;
			});
		}

		/**
		* アクティブ時のナビ（インジケーター）とスライドを更新する関数
		*/
		function upDateNavSlide(index) {
			//インジケーターのアクティブクラス削除・付与
			$indicator
				.find('a')
				.removeClass(CLASS_ACTIVE)
				.eq(index)
				.addClass(CLASS_ACTIVE);
			//スライドのアクティブクラス削除・付与
			$slide
				.removeClass(CLASS_ACTIVE)
				.eq(index)
				.addClass(CLASS_ACTIVE);
		}

		/*================================
		* イベントの設定
		================================*/
		// 初期化実行
		initSlider();

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
		var is_flag = true;

		$window
			.on('scroll', function () {
				// スクロール量がgNavのデフォルトの位置より大きくなったら
				if ($window.scrollTop() >= fixPos && is_flag === true) {
					$gNav.addClass(CLASS_FIX);
					is_flag = false;
				} else if ($window.scrollTop() < fixPos && is_flag === false) {
					$gNav.removeClass(CLASS_FIX);
					is_flag = true;
				}
			})
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
