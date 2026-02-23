$(function() {
    // 1. PC 서브메뉴 호버 (GNB 영역에 마우스 올릴 때)
    $('.gnb').on('mouseenter', function() {
        if($(window).width() > 768) {
            $('#header').addClass('open');
        }
    });

    $('#header').on('mouseleave', function() {
        $(this).removeClass('open');
    });

    // 2. 모바일 올메뉴 오픈
    $('.all_menu a').on('click', function(e) {
        e.preventDefault();
        
        // 뱅크 로고 복사해서 메뉴 안으로 넣기
        if($('.m_bank_area').length == 0) {
            $('.header_wrap').prepend('<div class="m_bank_area"></div>');
            $('.nh_bank_pc img').clone().appendTo('.m_bank_area');
        }
        
        $('.header_wrap').addClass('m_open');
        $('#dimmed').fadeIn();
    });

    // 3. 닫기 (배경 클릭)
    $('#dimmed').on('click', function() {
        $('.header_wrap').removeClass('m_open');
        $(this).fadeOut();
    });
});
