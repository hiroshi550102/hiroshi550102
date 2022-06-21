$(function() { 
	const page_type = $('.contents').attr('id');
	const param_value = location.search.substring(1).split('=')[1];
	const param_key = location.search.substring(1).split('=')[0];
	const categorys = ['tops','bottom','accessory'];
	const colors = {
		1:'ivory',
		2:'black',
		3:'navy',
		4:'white',
		5:'light-blue',
		6:'deep-blue',
		7:'raw-color'
	};
	
	// もっと見るボタン
	let more_count = {
		'brand':3,
		'items':10
	}
	
	function moreControl(el,num) {
	 const more_type = $(el).attr('data-more-btn');
	 const target_list = $(`[data-more-list="${more_type}"]`);
	 const max_count = target_list.find('li').length;
	 more_count[more_type] += num;
   target_list.find(`li:lt(${more_count[more_type]})`).fadeIn();
   if(more_count[more_type] >=  max_count ) {
		 $(el).hide();
	 }
	}

	$('[ data-more-btn="brand"]').on('click',function() {
		moreControl($(this),3);
	})
	$('[ data-more-btn="items"]').on('click',function() {
		moreControl($(this),10);
	})

	// HTMLオブジェクト変換
	function createDom(items, delate_btn_flg = null) {
    html_template = '';
    let delate_dom ='';
		if( delate_btn_flg) {
			delate_dom = '<div class="cart-delate"><img src="img/icon_delete.svg"></div>'
		}
		 items.forEach(function(item,index) {
				html_template += `	<li class="item" data-item-id="${item['id']}">
				<a href="detail.html?id=${item['id']}">
					<div class="item-cap"><img src="./img/item/${item['id']}.jpeg" alt="" loading="lazy"></div>
					<div class="item-info">
						<h3 class="item-name">${item['name']}</h3>
						<p class="item-text">${item['text']}</p>
						<div class="item-price">¥${item['price']}</div>
					</div>
				</a>
				${delate_dom}
			</li>`
		})
		return html_template;
	}

	// テキスト入力関数
	function searchWordShow() {
    let result_text = '';
		if(param_key == 'price') {
			result_text = `〜${param_value}円`;
			$(`.price-select option[value="${param_value}"]`).prop('selected', true);
		}else {
			result_text = param_value;
		}
		 $('.result-text').text(decodeURI(result_text));
	}

	// 複数アイテム取得
	function getItemList(key,value = null) {
		const search_value = value ? value : param_value;
		const freewords =['name','text'];
    items = item_data.filter(function(item,index) {
			switch(key) {
       case 'brand':
       case 'category':
			  return item[key] == search_value
				break;
       case 'freeword':
         return freewords.find(function(freeword,) {
          return item[freeword].indexOf(decodeURI(param_value)) !== -1;
				 })
				break;
       case'price':
			  return item['price'] <= search_value
				break;
       case'new':
			  return item['new'];
				break;
			}
		});
		searchWordShow();
		return items
	}
	// 一つのアイテム取得関数
  function getItemSingle() {
		return item_data.find(function(item) {
      return item['id'] == param_value;
		})
	}
	

	// ピックアップ
	function pickUpShuffle(item_data) {
		let items = [];
		let rand_check = [];
			for( let i = 0; i < 6; i++ ) {
			const j = Math. floor(Math.random() * item_data.length);
			if( rand_check.indexOf(j) !== -1 ) {
				i--;
				continue;
				}else {
				rand_check.push(j);
				items.push(item_data[j]);
			}
		}
		return items
	}
	let pickup = pickUpShuffle(item_data);
	$('[data-item-list="pickup"]').append(createDom(pickup))


	// フラッシュ
  function doneFlash(text) {
		$('body').append(`<div class="flash">${text}</div>`);
		setTimeout(function() {
     location.reload();
		},2000)
	}

	// ローカルストレージ
	function storageControl(id,storage_type) {
		let storage_data = JSON.parse(localStorage.getItem(`ninco-${storage_type}`));
		id = Number(id);
		if(storage_data == null) {
			storage_data = [id];
		}else {
			if( storage_data.indexOf(id) !== -1 ) {
        storage_data.splice(storage_data.indexOf(id), 1);
			}else {
				storage_data.push(id);
			}
		}
	 localStorage.setItem(`ninco-${storage_type}`, JSON.stringify(storage_data));
	}
	// ストレージに入っているかどうか？？
	function storageSaveJudge(id, storage_type) {
		let storage_data = JSON.parse(localStorage.getItem(`ninco-${storage_type}`));
		id = Number(id)
    if( storage_data !== null ) {
      return storage_data.indexOf(id) !== -1;
		}
	}

	// TOPのスライダー
	$('.top-slider').slick({
		arrows:true,
		autoplay:true,
		dots:true,
		speed:1500,
		easing:'swing',
		centerMode:true,
		centerPadding:'15%',
		prevArrow:'<div class="slide-btn prev-btn"></div>',
		nextArrow:'<div class="slide-btn next-btn"></div>',
		slidesToShow:2,
		slidesToScroll:1,

		responsive:[
			{
				breakpoint:768,
				settings:{
					centerPadding:'0',
					slidesToShow:1,
					slidesToScroll:1,
				}
			}
		]
	});

	// ハンバーガーメニュー
	$('.menu-trigger').on('click',function() {
		$(this).toggleClass('is-active');
		$('.header-links').toggleClass('is-active');
	})

	// サイズ詳細
	$('body').on('click','.item-size-list li',function() {
	   const select_num = $(this).text();
		 $(this).addClass('is-active');
		 $(this).siblings('li').removeClass('is-active');
		 $('.item-size-select span').text(select_num)

	})
  
	// レビュー
	 let review_num = 0;
	 $('.review li').on('click',function() {
		 if( review_num == $('.review li').index(this) + 1) {
			$('.review li').removeClass('is-active');
			let review_num = 0;
		 }else {
			review_num = $('.review li').index(this) + 1;
			$('.review li').removeClass('is-active');
			$(`.review li:lt(${review_num})`).addClass('is-active');
		 }
	 });
	
	//  アコーディオン　
	$('[data-accordion="trigger"]').on('click',function() {
		$(this).toggleClass('is-active');
		$(this).next().slideToggle()
	})

 	$(window).on('scroll',function() {
		// フェードイン
		$('[data-fadeIn]').each(function(index,el) {
			if($(window).scrollTop() > ($(el).offset().top - $(window).height() / 2 )) {
				$(el).addClass('is-over');
			}
		})
		// ヘッダーフェードイン
		$('[data-fade-head]').each(function(index,el) {
			if($(window).scrollTop() > ($(el).offset().top - $(window).height() / 2 )) {
				$(el).addClass('is-over');
			}
		})
	})

  // フォーカス
	 $('.word-search').focus(function() {
    $(this).addClass('is-cursol')
	 }).blur(function() {
    $(this).removeClass('is-cursol')
	 })

	//  モーダル
	 $('.controls-cart').on('click',function(e) {
		 e.preventDefault();
		 $('.modal-wrap').fadeToggle();
		 $('.menu-trigger, .header-links').removeClass('is-active');
	 })
	 $('.modal-close, .modal-wrap').on('click',function() {
		 $('.modal-wrap').fadeOut();
	 })

	
  // カートに追加
   $('.btn--cart').on('click',function() {
		 const item_id = $(this).parents('.item-detail').attr
		 ('data-item-id');
		 storageControl(item_id,'cart');
		 if( storageSaveJudge(item_id,'cart') ) {
      doneFlash('カートに追加しました');
		 }else {
			doneFlash('カートから外しました');
		 }
	 })

	//  カートに入れたアイテムを生成((選択したものをカートに入れる)
  const cart_storage = JSON.parse(localStorage.getItem('ninco-cart'));
	if( cart_storage !== null ) {
		let cart_price = 0;
		const cart_items = item_data.filter(function(item) {
			if( cart_storage.indexOf(item['id']) !== -1) {
				cart_price += item['price'];
				return item
			}
		})
		$('#cart-list').append(createDom(cart_items, true));
		// カートの中身の合計金額
		$('.cart-total-price').text(cart_price + '円');
		// カートの合計点数
		$('.cart-banth ,.cart-total-num').text(cart_storage.length);
	   if(cart_storage.length <= 0 ) {
			 $('.cart-banth').hide()
		 }
	 }else {
		$('.cart-banth').hide();
	}

	  // カートから削除
		$('body').on('click','.cart-delate', function() {
			if( confirm('本当に削除して良いですか？') ){
				const item_id = $(this).parents('[data-item-id]').attr('data-item-id');
				storageControl(item_id,'cart');
				setTimeout(function() {
         location.reload();
				},200)
			}
		})

		// 購入ボタンを押した時
		$('.btn--buy').on('click',function() {
		 if( confirm('本当に購入して良いですか？')) {
			 localStorage.removeItem('ninco-cart');
			 confirm('購入しました');
		 }
			
		});

		// お気に入りに追加
		$('.btn--fav').on('click',function() {
			const item_id = $(this).parents('.item-detail').attr
			('data-item-id');
			storageControl(item_id,'fav');
			if( storageSaveJudge(item_id, 'fav') ) {
			doneFlash('お気に入りに追加しました');
			}else {
			doneFlash('お気に入りから外しました');
			}
		})

		//  お気に入りに入れたアイテムを生成((選択したものをカートに入れる)
		const fav_storage = JSON.parse(localStorage.getItem('ninco-fav'));
		if( fav_storage !== null ) {
			const fav_items = item_data.filter(function(item) {
				if( fav_storage.indexOf(item['id']) !== -1) {
					return item;
				}
			});
			$('[data-item-list="fav"]').append(createDom(fav_items));
		}

		// お気に入りのスライダー
	$('[data-item-list="fav"]').slick({
		arrows:true,
		autoplay:true,
		speed:1500,
		easing:'swing',
		centerMode:true,
		centerPadding:'18%',
		prevArrow:'<div class="slide-btn prev-btn"></div>',
		nextArrow:'<div class="slide-btn next-btn"></div>',
		slidesToShow:3,
		slidesToScroll:1,

		responsive:[
			{
				breakpoint:768,
				settings:{
					centerPadding:'',
					slidesToShow:2,
					slidesToScroll:1,
				}
			}
		]
	});
		
		// index-ページのみ
		if( page_type == 'page-index') {
			let item_list_new = getItemList('new');
			$('[ data-item-list="new"]').append(createDom(item_list_new));
			categorys.forEach(function(category,index) {
				let item_list_category = getItemList('category',category);
				$(`[data-item-list="${category}"]`).append(createDom(item_list_category))
			})
		}
		// listページのみ　
		if( page_type == 'page-list') {
			let item_list = getItemList(param_key);
			$('.sort-list').append(createDom(item_list));
			$('.price-select').on('change',function() {
				$('#price-form').submit();
			})
		}

	// datailページのみ
	if( page_type == 'page-detail') {
		const item_detail = getItemSingle();
		Object.keys(item_detail).forEach(function(key) {
			$(`[data-item-parts="${key}"]`).text(item_detail[key]);
			$('#zoom-img').attr('src', `./img/item/${item_detail['id']}.jpeg`);
			$('.item-detail').attr('data-item-id', item_detail['id']);
			if(!item_detail['new']) {
			$('.new-label').remove();
		  }
	  })	
		for (let key in colors) {
			let exist = '';
			if( item_detail['color'].indexOf(Number(key)) !== -1 ){
				const color_elm = `<li class="" data-item-parts="${key}">${colors[key]}</li>`;
				$('.item-size-list').append(color_elm);	
			}
	}
			const storage_types = ['cart', 'fav'];
			storage_types.forEach(function(type){
				if( storageSaveJudge(item_detail['id'], type) ){
							$(`.btn--${type}`).addClass('is-storage');
				}
			}); 
  }
	 // detailスライダー
	 $('[data-item-image="pic"]').slick({
		arrows:true,
		autoplay:true,
		speed:1500,
		easing:'swing',
		centerMode:true,
		centerPadding:'18%',
		prevArrow:'<div class="slide-btn prev-btn"></div>',
		nextArrow:'<div class="slide-btn next-btn"></div>',
		slidesToShow:3,
		slidesToScroll:1,

		responsive:[
			{
				breakpoint:768,
				settings:{
					centerPadding:'',
					slidesToShow:2,
					slidesToScroll:1,
				}
			}
		]
	 });
	

	
	
	

}) 

// ローダーlist
// $(window).on('load',function() {
// 	setTimeout(function() {
//   $('.main_logo').fadeOut();
// 	},2000)
// })

$(window).on('load',function() {
	// ローダーmain 
	setTimeout(function() {
		$('.main-logo').fadeOut()
	},2000)
	
  // ローダー
  setTimeout(function() {
		$('.loader').fadeOut();
	 },2000)
})







