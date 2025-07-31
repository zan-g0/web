// 自动加载 images/banner 文件夹下所有图片
fetch('./js/banner-list.json')
    .then(res => res.json())
    .then(files => {
        const carouselInner = document.getElementById('carousel-inner');
        files.forEach((file, idx) => {
            const div = document.createElement('div');
            div.className = 'carousel-item' + (idx === 0 ? ' active' : '');
            div.innerHTML = `<img src="./images/banner/${file}" class="d-block w-100" alt="banner${idx + 1}">`;
            carouselInner.appendChild(div);
        });
    });