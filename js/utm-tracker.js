// utm-tracker.js - Sistema de rastreamento de UTMs
(function() {
    'use strict';

    // ========================================
    // CAPTURA E PERSISTÊNCIA DE UTMs
    // ========================================
    
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
                params[key] = decodeURIComponent(value || '');
            }
        });
        
        return params;
    }
    
    function getOrSetSession(key, defaultValue) {
        let value = sessionStorage.getItem(key);
        if (!value && defaultValue) {
            value = defaultValue;
            sessionStorage.setItem(key, value);
        }
        return value;
    }
    
    // Captura UTMs da URL atual
    const currentQuery = getQueryParams();
    
    const utmSource = currentQuery.utm_source || getOrSetSession('utm_source', null) || 'LpLda';
    const utmMedium = currentQuery.utm_medium || getOrSetSession('utm_medium', null) || '';
    
    sessionStorage.setItem('utm_source', utmSource);
    sessionStorage.setItem('utm_medium', utmMedium);
    
    
    // ========================================
    // FUNÇÃO: ADICIONAR UTMs A URL
    // ========================================
    
    function addUtmsToUrl(baseUrl, utmParams) {
        try {
            const url = new URL(baseUrl);
            
            Object.keys(utmParams).forEach(key => {
                if (!url.searchParams.has(key) && utmParams[key]) {
                    url.searchParams.append(key, utmParams[key]);
                }
            });
            
            if (currentQuery.extra_params && !url.searchParams.has('extra_params')) {
                url.searchParams.append('extra_params', currentQuery.extra_params);
            }
            
            return url.toString();
        } catch (error) {
            console.error('Erro ao processar URL:', error);
            return baseUrl;
        }
    }
    
    
    // ========================================
    // PROCESSA TODOS OS LINKS
    // ========================================
    
    function processLinks() {
        // Checkout: todos os links para pay.kiwify.com.br/oB6rZiR
        const checkoutLinks = document.querySelectorAll('a[href*="pay.kiwify.com.br/oB6rZiR"]');
        
        checkoutLinks.forEach(link => {
            const baseUrl = link.getAttribute('href');
            
            // Cria utm_campaign baseado no contexto do link
            let utmCampaign = 'LDABiblica';
            if (link.closest('.hero')) {
                utmCampaign = 'lplda1';
            } else if (link.closest('.cta-section')) {
                utmCampaign = 'cta-lda';
            }
            
            const utmParams = {
                utm_source: sessionStorage.getItem('utm_source') || 'LpLda',
                utm_medium: sessionStorage.getItem('utm_medium') || '',
                utm_campaign: utmCampaign
            };
            
            const finalUrl = addUtmsToUrl(baseUrl, utmParams);
            
            // Atualiza o link no carregamento (mobile)
            link.setAttribute('href', finalUrl);
            
            // Reforça no mouseover (desktop)
            link.addEventListener('mouseenter', function() {
                this.setAttribute('href', finalUrl);
            });
        });
        
        
        // Landing Page: link para suellenseragi.com.br no header
        const headerHomeLink = document.querySelector('.nav-brand a[href*="suellenseragi.com.br"]');
        
        if (headerHomeLink) {
            const baseUrl = headerHomeLink.getAttribute('href');
            
            const utmParams = {
                utm_source: sessionStorage.getItem('utm_source') || 'LpLda',
                utm_medium: sessionStorage.getItem('utm_medium') || ''
            };
            
            const finalUrl = addUtmsToUrl(baseUrl, utmParams);
            
            headerHomeLink.setAttribute('href', finalUrl);
            
            headerHomeLink.addEventListener('mouseenter', function() {
                this.setAttribute('href', finalUrl);
            });
        }
    }
    
    
    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processLinks);
    } else {
        processLinks();
    }
    
})();
