package com.witbooking.admin.proxy;

import com.witbooking.admin.proxy.filters.pre.AuthFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created by mongoose on 9/05/15.
 */
@Configuration
public class ZuulConfiguration {

    @Bean
    public AuthFilter authFilter() {
        return new AuthFilter();
    }

}
