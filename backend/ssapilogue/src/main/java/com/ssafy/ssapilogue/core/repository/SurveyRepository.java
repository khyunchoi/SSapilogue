package com.ssafy.ssapilogue.core.repository;

import com.ssafy.ssapilogue.core.domain.Survey;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SurveyRepository extends MongoRepository<Survey, String> {
    List<Survey> findAllByProjectId(Long projectId);
}
