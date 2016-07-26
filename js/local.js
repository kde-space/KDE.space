$(function () {
	slider();

	gNavStickey();

	$('body').each(function () {
		var $target = $('.sec');
		var showHeight = 200; // 表示される高さ
		$target.css({opacity: 0});

		$(window).on('load scroll resize', function () {
			var $window = $(this);
			var scrollTop = $window.scrollTop();
			var windowHeight = $window.innerHeight();

			$target.each(function () {
				var $thisArea = $(this);
				var areaOffsetTop = $thisArea.offset().top;
				if (scrollTop > (areaOffsetTop + showHeight) - windowHeight) {
					$thisArea.stop().animate({opacity: 1}, 500);
				} else {
					$thisArea.stop().animate({opacity: 0}, 500);
				}
			});
		});
	});


	$('.scroll').smoothScroll({
		positioning: -80,
		callback: function () {
			//全要素からフォーカスを外す
			document.activeElement.blur();
		}
	});

	$('.js-textTypo').each(function () {
		var $targetParent = $(this);
		var $targetItem = $targetParent.find('.js-textTypo-item');
		var durationTotalTime = 0; // アニメーション終了までの各ブロック毎の合計時間用
		var durationTotalTimeAry = [0]; // 上記を配列に格納用

		$targetItem.each(function (e) {
			var $this = $(this);
			var ary = $this.text().split(''); // テキストを1文字ずつ配列に格納
			var htm = '';
			var durationTime = 0; // 最後の文字のアニメーション開始までの時間を取得用
			for (var i = 0; i < ary.length; i++) {
				htm += '<span style="animation-delay:' + (i*60 + 500) + 'ms;">' + ary[i] + '</span>';
				durationTime = i*60 + 500;
			}
			// アニメーション終了時間を加算し
			// 配列に格納
			durationTotalTime += durationTime;
			durationTotalTimeAry.push(durationTotalTime);
			// html書き換え
			$this.html(htm);

			$(window).on('load', function () {
				// アニメーションが完了したら次のブロックのアニメーションを開始する
				setTimeout(function () {
					$this.addClass('is-start');
				}, durationTotalTimeAry[e]);
			});
		});
	});
});


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
		var EASING = 'easeOutQuad'; // イージング

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
			$slideGroupWrap.stop().animate({
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
		var gNavOffsetTop = $gNav.offset().top; // gNavのデフォルトの位置
		var CLASS_FIX = 'is-fixed';
		var flag = true;

		$window.on('scroll', function () {
			// スクロール量がgNavのデフォルトの位置より大きくなったら
			if ($window.scrollTop() >= gNavOffsetTop && flag === true) {
				$gNav.addClass(CLASS_FIX);
				flag = false;
			} else if ($window.scrollTop() < gNavOffsetTop && flag === false) {
				$gNav.removeClass(CLASS_FIX);
				flag = true;
			}
		}).trigger('scroll'); // スクロールイベントを発生させる
	});
}
