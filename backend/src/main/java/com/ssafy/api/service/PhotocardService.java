package com.ssafy.api.service;

import com.ssafy.api.request.PhotocardRegistPostReq;
import com.ssafy.common.exception.handler.PhotocardException;
import com.ssafy.common.exception.handler.UserException;
import com.ssafy.db.entity.board.Photocard;

import java.util.List;

public interface PhotocardService {

    void createPhotocard(PhotocardRegistPostReq photocardRegistPostReq) throws Exception;
    List<Photocard> readPhotocardList(int offset, int limit);
    List<Photocard> readMyPhotocardList(int offset, int limit, String email) throws UserException;
    Long photocardCount();
    Long myPhotocardCount(String email);
    void deletePhotocard(Long id) throws PhotocardException;
    Long countLikes(Photocard photocard);
    Boolean checkLikes(String email, Long id);
    void createLikes(String email, Long id) throws Exception;
    void deleteLikes(String email, Long id) throws Exception;



}
