package com.ssafy.db.repository;

import com.ssafy.db.entity.User.Auth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * auth 모델 관련 디비 쿼리 생성을 위한 JPA Query Method 인터페이스 정의.
 */
@Repository
public interface AuthRepository extends JpaRepository<Auth, Long> {
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Auth set refreshToken = :token where email = :email")
    int saveRefreshToken(String email, String token);


}
