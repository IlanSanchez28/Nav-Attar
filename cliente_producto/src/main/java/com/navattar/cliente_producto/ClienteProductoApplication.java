package com.navattar.cliente_producto;

import com.navattar.cliente_producto.filter.JwtFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ClienteProductoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClienteProductoApplication.class, args);
	}

	//Aqui va a arrancar mi filtro
	@Bean
	public FilterRegistrationBean<JwtFilter> jwtFilter(){
		FilterRegistrationBean<JwtFilter> registrationBean = new FilterRegistrationBean<JwtFilter>();

		registrationBean.setFilter(new JwtFilter());
		registrationBean.addUrlPatterns("/api/clientes/*"); //lo que este en esta url va a entrar a mi filtro
		registrationBean.addUrlPatterns("/api/clientes");
		return registrationBean;
	}//jwtFilter
}
